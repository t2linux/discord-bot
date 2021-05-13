import { Channel, GuildMember, Message } from 'discord.js';
import { config, data } from '.';
import { ChannelArgument } from './argument/channelArgument';
import { Command } from './command';

export class GetRolesCommand extends Command {

    public name(): string {
        return 'getRoles';
    }

    public description(): string {
        return 'Lists all role reaction emojis of a channel';
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return config.discord.admin.includes(member.id);
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ channelArgument ] = args;

        const channel: Channel = await ChannelArgument.parse(message, channelArgument);

        if (!data.hasChannel(channel.id)) {
            message.channel.send('The specified channel has no emojis stored');

            return;
        }

        message.channel.send(data.getChannel(channel.id).map(entry => `${entry.emoji} => ${entry.role}`).join('\n'));
    }
}