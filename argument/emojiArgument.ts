import { DeconstructedSnowflake, Emoji, Message, SnowflakeUtil } from 'discord.js';
import * as emoji from 'node-emoji';
import { ArgumentError } from './argumentError';
import { RegexBasedArgument } from './base/regexBasedArgument';

export type EmojiType = 'all' | 'unicode' | 'custom';

export class EmojiArgument extends RegexBasedArgument {

    public static async parse(message: Message, input: string, type: EmojiType = 'all'): Promise<string | Emoji> {
        if (!input)
            throw new ArgumentError('EmojiArgument: No input provided');

        if (emoji.hasEmoji(input)) {
            const withColons: string = emoji.unemojify(input);

            if (withColons.split('').filter(character => character === ':').length === 2 && withColons.startsWith(':') && withColons.endsWith(':')) {
                if (type === 'custom')
                    throw new ArgumentError(`EmojiArgument: Required type custom but input is of type unicode`);

                return withColons;
            } else {
                throw new ArgumentError(`EmojiArgument: Invalid format (expected unicode emoji, got \`${input.replaceAll('`', '')}\`)`);
            }
        }

        if (type === 'unicode')
            throw new ArgumentError(`EmojiArgument: Required type ${type} but input does not match`);

        const match: RegExpMatchArray = this.regex('EmojiArgument', /^<a?:(.*):(\d*)>$/, input);
        const parsed: DeconstructedSnowflake = SnowflakeUtil.deconstruct(match[2]);

        if (parsed.timestamp < SnowflakeUtil.EPOCH)
            throw new ArgumentError(`EmojiArgument: Invalid snowflake`);

        return (await message.guild.fetch()).emojis.resolve(match[2]);
    }
}