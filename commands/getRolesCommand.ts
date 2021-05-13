import { Channel, GuildMember, Message, MessageEmbed } from 'discord.js';
import { config, data } from '..';
import { Argument } from '../argument';
import { ChannelArgument } from '../arguments/channelArgument';
import { Command } from '../command';
import { CommandError } from '../commandError';

export class GetRolesCommand extends Command {

    public name(): string {
        return 'getRoles';
    }

    public description(): string {
        return 'Lists all role reaction emojis of a channel';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'channel', type: 'Channel', description: 'The channel of which the role reaction emojis should be listed' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return config.discord.admin.includes(member.id);
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ channelArgument ] = args;

        const channel: Channel = await ChannelArgument.parse(message, channelArgument);

        if (!data.hasChannel(channel.id))
            throw CommandError.generic('GetRoles', 'The specified channel has no emojis stored');

        message.channel.send(new MessageEmbed()
            .setTitle('GetRoles')
            .setDescription(data.getChannel(channel.id).map(entry => `${entry.emoji} => ${entry.role}`).join('\n')));
    }
}