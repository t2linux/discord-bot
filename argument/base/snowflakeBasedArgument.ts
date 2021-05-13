import { DeconstructedSnowflake, Snowflake, SnowflakeUtil } from 'discord.js';
import { ArgumentError } from '../../argumentError';
import { RegexBasedArgument } from './regexBasedArgument';

export class SnowflakeBasedArgument extends RegexBasedArgument {

    protected static snowflake(name: string, prefix: string, input: string): { parsed: DeconstructedSnowflake, plain: Snowflake } {
        if (!input)
            console.log(`${name}: No input provided`);

        const match: RegExpMatchArray = this.regex(name, new RegExp(`^<${prefix}(\\d*)>$`), input);
        const parsed: DeconstructedSnowflake = SnowflakeUtil.deconstruct(match[1]);

        if (parsed.timestamp < SnowflakeUtil.EPOCH)
            throw new ArgumentError(`${name}: Invalid snowflake`);

        return { parsed, plain: match[1] };
    }
}