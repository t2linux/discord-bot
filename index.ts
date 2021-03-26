import { Guild, GuildChannel, GuildMember } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import * as files from 'fs';
import { Config } from './config';
import { Data } from './data';
import { SetRoleCommand } from './setRoleCommand';
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

    client.registry
        .registerDefaultTypes()
        .registerGroup('admin', 'Administration commands')
        .registerGroup('user', 'User commands')
        .registerCommand(new SetRoleCommand(client, data))
        .registerCommand(new WikiCommand(client, data));

    // requires the use of raw events to get the member 'user_id'
    // @ts-ignore
    client.on('raw', async event => {
        if (event.t === 'MESSAGE_REACTION_ADD') {
            if (event.d.user_id === client.user.id) return;

            if (data.hasChannel(event.d.channel_id)) {
                if (data.hasEmoji(event.d.channel_id, event.d.emoji.id)) {
                    const guild: Guild = (await client.channels.fetch(event.d.channel_id) as GuildChannel).guild;
                    const member: GuildMember = await guild.members.fetch(event.d.user_id);
                    const role: string = data.getRole(event.d.channel_id, event.d.emoji.id);

                    console.log('Roles: ' + member.user.tag + ' added role ' + role);

                    member.roles.add(role);
                }
            }
        } else if (event.t === 'MESSAGE_REACTION_REMOVE') {
            if (event.d.user_id === client.user.id) return;

            if (data.hasChannel(event.d.channel_id)) {
                if (data.hasEmoji(event.d.channel_id, event.d.emoji.id)) {
                    const guild: Guild = (await client.channels.fetch(event.d.channel_id) as GuildChannel).guild;
                    const member: GuildMember = await guild.members.fetch(event.d.user_id);
                    const role: string = data.getRole(event.d.channel_id, event.d.emoji.id);

                    console.log('Roles: ' + member.user.tag + ' removed role ' + role);

                    member.roles.remove(role);
                }
            }
        }
    });

    console.log('Discord: Logged in as ' + client.user.tag);
})();