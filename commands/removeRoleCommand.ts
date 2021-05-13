import { Channel, Emoji, GuildMember, Message } from 'discord.js';
import { config, data } from '..';
import { Argument } from '../argument';
import { ChannelArgument } from '../argument/channelArgument';
import { EmojiArgument } from '../argument/emojiArgument';
import { Command } from '../command';

export class RemoveRoleCommand extends Command {

    public name(): string {
        return 'removeRole';
    }

    public description(): string {
        return 'Removes an emoji as an reaction emoji from a specified channel';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'channel', type: 'Channel', description: 'The channel in which the reaction emoji should be removed' },
            { name: 'emoji', type: 'CustomEmoji | UnicodeEmoji', description: 'The emoji of the reaction emoji to be removed' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return config.discord.admin.includes(member.id);
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ channelArgument, emojiArgument ] = args;

        const channel: Channel = await ChannelArgument.parse(message, channelArgument);
        const emoji: string | Emoji = await EmojiArgument.parse(message, emojiArgument);

        const emojiId: string = typeof emoji === 'string' ? emoji : emoji.id;

        data.removeEmoji(channel.id, emojiId);

        message.react('👌');
    }
}