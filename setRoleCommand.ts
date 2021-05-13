import { Channel, Emoji, GuildMember, Message, Role } from 'discord.js';
import { config, data } from '.';
import { ChannelArgument } from './argument/channelArgument';
import { EmojiArgument } from './argument/emojiArgument';
import { RoleArgument } from './argument/roleArgument';
import { Command } from './command';

export class SetRoleCommand extends Command {

    public name(): string {
        return 'setRole';
    }

    public description(): string {
        return 'Registers an emoji as a role reaction emoji in a specified channel';
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return config.discord.admin.includes(member.id);
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ roleArgument, channelArgument, emojiArgument ] = args;

        const role: Role = await RoleArgument.parse(message, roleArgument);
        const channel: Channel = await ChannelArgument.parse(message, channelArgument);
        const emoji: string | Emoji = await EmojiArgument.parse(message, emojiArgument);

        const emojiId: string = typeof emoji === 'string' ? emoji : emoji.id;

        data.addEmoji(channel.id, emojiId, role.id);

        message.react('👌');
    }
}