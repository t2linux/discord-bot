import { Emoji, MessageEmbed, TextChannel } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Data } from './data';

export class SetRoleCommand extends Command {
    public constructor(client: CommandoClient, private data: Data) {
        super(client, {
            name: 'setrole',
            group: 'admin',
            memberName: 'setrole',
            description: 'Adds a new role reaction message to the specified channel',
            args: [
                { key: 'channel', type: 'text-channel', prompt: 'The channel in which the reaction message should be sent' },
                { key: 'customEmoji', type: 'custom-emoji', prompt: 'The emote that can be reacted with to get the role' },
                { key: 'role', type: 'role', prompt: 'The role to be given when reacting', default: '!!norole!!' }
            ]
        });
    }

    public run(message: CommandoMessage, { channel, customEmoji, role }): any {
        const emoji: Emoji = customEmoji as Emoji;
        const textChannel: TextChannel = channel as TextChannel;

        if (this.data.hasEmoji(textChannel.id, emoji.id)) this.data.removeEmoji(textChannel.id, emoji.id);

        message.react('👌');

        if (role === '!!norole!!') return;

        this.data.addEmoji(textChannel.id, emoji.id, role.id);
    }
}