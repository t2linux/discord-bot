import { Client, Guild, GuildChannel, GuildMember, Message, MessageReaction, PartialUser, User } from 'discord.js';
import * as files from 'fs';
import { ArgumentError } from './argumentError';
import { Command } from './command';
import { GetRolesCommand } from './commands/getRolesCommand';
import { HelpCommand } from './commands/helpCommand';
import { RemoveRoleCommand } from './commands/removeRoleCommand';
import { SetRoleCommand } from './commands/setRoleCommand';
import { WikiCommand } from './commands/wikiCommand';
import { Config } from './config';
import { Data } from './data';

export const config: Config = JSON.parse(files.readFileSync('config.json').toString());
export const data: Data = new Data();
export const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
export const primaryColor: string = '#7663E8';
export const commands: Array<Command> = [
    new SetRoleCommand(),
    new RemoveRoleCommand(),
    new GetRolesCommand(),
    new WikiCommand(),
    new HelpCommand()
];

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

    const processReactionEvent = async (reaction: MessageReaction, user: User | PartialUser, callback: (member: GuildMember, role: string) => void) => {
        const message: Message = await reaction.message.fetch();

        if (reaction.partial) reaction = await reaction.fetch();

        if (user.id === client.user.id) return;

        if (data.hasChannel(message.channel.id)) {
            let identifier: string;

            if (data.hasEmoji(message.channel.id, reaction.emoji.id))
                identifier = reaction.emoji.id;

            if (data.hasEmoji(message.channel.id, reaction.emoji.name))
                identifier = reaction.emoji.name;

            if (!identifier)
                return;

            const guild: Guild = (await client.channels.fetch(message.channel.id) as GuildChannel).guild;
            const member: GuildMember = await guild.members.fetch(user.id);
            const role: string = data.getRole(message.channel.id, identifier);

            callback(member, role);
        }
    };

    client.on('messageReactionAdd', async (reaction: MessageReaction, user: User | PartialUser) => processReactionEvent(reaction, user, (member, role) => {
        console.log('Roles: ' + user.tag + ' added role ' + role);

        member.roles.add(role);
    }));

    client.on('messageReactionRemove', async (reaction: MessageReaction, user: User | PartialUser) => processReactionEvent(reaction, user, (member, role) => {
        console.log('Roles: ' + member.user.tag + ' removed role ' + role);

        member.roles.remove(role);
    }));

    console.log('Discord: Logged in as ' + client.user.tag);
})();