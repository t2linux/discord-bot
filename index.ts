import { Client, Guild, GuildChannel, GuildMember } from 'discord.js';
import * as files from 'fs';
import { ArgumentError } from './argument/argumentError';
import { Command } from './command';
import { Config } from './config';
import { Data } from './data';
import { SetRoleCommand } from './setRoleCommand';
import { SetRoleDefaultCommand } from './setRoleDefaultCommand';
import { WikiCommand } from './wikicommand';

const config: Config = JSON.parse(files.readFileSync('config.json').toString());
const data: Data = new Data();
const client = new CommandoClient(config.discord.options);

(async () => {
    await client.login(config.discord.token);

    client.user.setActivity({
        type: 'WATCHING',
        name: 'wiki.t2linux.org'
    });

    client.on('message', message => {
        if (message.author.bot)
            return;

        const content: string = message.content;

        if (content.startsWith(config.discord.commandPrefix)) {
            const args: Array<string> = content.substring(1).split(' ').filter(argument => argument.trim() !== '');

            for (const command of commands) {
                if (command.name().toLowerCase() === args[0].toLowerCase()) {
                    return command.handle(message, args.slice(1)).catch(error => {
                        if (error instanceof ArgumentError)
                            return message.channel.send(error.content);

                        message.channel.send('An error occured: ' + error);
                    });
                }
            }
        }
    });

    // requires the use of raw events to get the member 'user_id'
    // @ts-ignore
    client.on('raw', async event => {
        if (event.t === 'MESSAGE_REACTION_ADD') {
            if (event.d.user_id === client.user.id) return;

            if (data.hasChannel(event.d.channel_id)) {
                let identifier: string;

                if (data.hasEmoji(event.d.channel_id, event.d.emoji.id))
                    identifier = event.d.emoji.id;

                if (data.hasEmoji(event.d.channel_id, event.d.emoji.name))
                    identifier = event.d.emoji.name;

                if (!identifier)
                    return;

                const guild: Guild = (await client.channels.fetch(event.d.channel_id) as GuildChannel).guild;
                const member: GuildMember = await guild.members.fetch(event.d.user_id);
                const role: string = data.getRole(event.d.channel_id, identifier);

                console.log('Roles: ' + member.user.tag + ' added role ' + role);

                member.roles.add(role);
            }
        } else if (event.t === 'MESSAGE_REACTION_REMOVE') {
            if (event.d.user_id === client.user.id) return;

            if (data.hasChannel(event.d.channel_id)) {
                let identifier: string;

                if (data.hasEmoji(event.d.channel_id, event.d.emoji.id))
                    identifier = event.d.emoji.id;

                if (data.hasEmoji(event.d.channel_id, event.d.emoji.name))
                    identifier = event.d.emoji.name;

                if (!identifier)
                    return;

                const guild: Guild = (await client.channels.fetch(event.d.channel_id) as GuildChannel).guild;
                const member: GuildMember = await guild.members.fetch(event.d.user_id);
                const role: string = data.getRole(event.d.channel_id, identifier);

                console.log('Roles: ' + member.user.tag + ' removed role ' + role);

                member.roles.remove(role);
            }
        }
    });

    console.log('Discord: Logged in as ' + client.user.tag);
})();