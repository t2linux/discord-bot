import { Channel, Message } from 'discord.js';
import { client } from '..';
import { ArgumentError } from '../argumentError';
import { SnowflakeBasedArgument } from './base/snowflakeBasedArgument';

export class ChannelArgument extends SnowflakeBasedArgument {

    public static async parse(message: Message, input: string): Promise<Channel> {
        if (!input)
            throw new ArgumentError('ChannelArgument: No input provided');

        const { plain } = this.snowflake('ChannelArgument', '#', input);

        return await client.channels.fetch(plain);
    }
}