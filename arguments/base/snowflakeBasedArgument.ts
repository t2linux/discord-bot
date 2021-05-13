import { DeconstructedSnowflake, Snowflake, SnowflakeUtil } from 'discord.js';
import { CommandError } from '../../commandError';
import { RegexBasedArgument } from './regexBasedArgument';

export class SnowflakeBasedArgument extends RegexBasedArgument {

    protected static snowflake(name: string, prefix: string, input: string): { parsed: DeconstructedSnowflake, plain: Snowflake } {
        if (!input)
            throw CommandError.syntax(name, 'No input provided');

        const match: RegExpMatchArray = this.regex(name, new RegExp(`^<${prefix}(\\d*)>$`), input);
        const { valid, parsed } = this.validateSnowflake(match[1]);

        if (!valid)
            throw CommandError.syntax(name, `Expected snowflake but got ${match[1].replaceAll('`', '')} instead`);

        return { parsed, plain: match[1] };
    }

    protected static validateSnowflake(snowflake: string): { valid: boolean, parsed: DeconstructedSnowflake } {
        const parsed: DeconstructedSnowflake = SnowflakeUtil.deconstruct(snowflake);

        return { valid: parsed.timestamp > SnowflakeUtil.EPOCH && !isNaN(parsed.date.valueOf()), parsed };
    }
}