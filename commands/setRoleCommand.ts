import { Channel, Emoji, GuildMember, Message, Role } from 'discord.js';
import { config, data } from '..';
import { Argument } from '../argument';
import { ChannelArgument } from '../arguments/channelArgument';
import { EmojiArgument } from '../arguments/emojiArgument';
import { RoleArgument } from '../arguments/roleArgument';
import { Command } from '../command';

export class SetRoleCommand extends Command {

    public name(): string {
        return 'setRole';
    }

    public description(): string {
        return 'Registers or replaces an emoji as a role reaction emoji in a specified channel';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'role', type: 'Role', description: 'The role of the role reaction emoji to be registerd' },
            { name: 'channel', type: 'Channel', description: 'The channel in which the role reaction emoji should be registered' },
            { name: 'emoji', type: 'CustomEmoji | UnicodeEmoji', description: 'The emoji of the role reaction emoji to be registered' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return config.discord.admin.includes(member.id);
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ roleArgument, channelArgument, emojiArgument ] = args;

        const role: Role = await RoleArgument.parse(message, roleArgument);
        const channel: Channel = await ChannelArgument.parse(channelArgument);
        const emoji: string | Emoji = await EmojiArgument.parse(message, emojiArgument);

        const emojiId: string = typeof emoji === 'string' ? emoji : emoji.id;

        if (data.hasEmoji(channel.id, emojiId))
            data.removeEmoji(channel.id, emojiId);

        data.addEmoji(channel.id, emojiId, role.id);

        message.react('👌');
    }
}