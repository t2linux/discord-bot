import { Message, Role } from 'discord.js';
import { CommandError } from '../commandError';
import { SnowflakeBasedArgument } from './base/snowflakeBasedArgument';

export class RoleArgument extends SnowflakeBasedArgument {

    public static async parse(message: Message, input: string): Promise<Role> {
        if (!input)
            throw CommandError.syntax('RoleArgument', 'No input provided');

        const { plain } = this.snowflake('RoleArgument', '@[&|!]', input);

        return await message.guild.roles.fetch(plain);
    }
}