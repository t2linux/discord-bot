import { Channel, Guild, Message } from 'discord.js';
import { client } from '..';
import { CommandError } from '../commandError';
import { SnowflakeBasedArgument } from './base/snowflakeBasedArgument';

export class MessageLinkArgument extends SnowflakeBasedArgument {

    public static async parse(input: string): Promise<Message> {
        if (!input)
            throw CommandError.syntax('MessageLinkArgument', 'No input provided');

        const match: RegExpMatchArray = this.regex('MessageLinkArgument', /https:\/\/(?:canary\.|ptb\.)?discord\.com\/channels\/(\d*)\/(\d*)\/(\d*)/, input);

        if (!this.validateSnowflake(match[1]) || !this.validateSnowflake(match[2]) || !this.validateSnowflake(match[3]))
            throw CommandError.syntax('MessageLinkArgument', 'One or more snowflakes in the link are invalid');

        const guild: Guild = await client.guilds.fetch(match[1]);
        const channel: Channel = await guild.channels.resolve(match[2]);

        if (!channel.isText())
            throw CommandError.semantic('MessageLinkArgument', 'Linked channel does not have the type text');

        return channel.messages.fetch(match[3]);
    }
}