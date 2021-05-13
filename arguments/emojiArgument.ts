import { DeconstructedSnowflake, Emoji, Message, SnowflakeUtil } from 'discord.js';
import * as emoji from 'node-emoji';
import { CommandError } from '../commandError';
import { RegexBasedArgument } from './base/regexBasedArgument';

export type EmojiType = 'all' | 'unicode' | 'custom';

export class EmojiArgument extends RegexBasedArgument {

    private static readonly regionalIndicators: Map<string, string> = new Map<string, string>([
        ['🇦', ':regional_indicator_a:'],
        ['🇧', ':regional_indicator_b:'],
        ['🇨', ':regional_indicator_c:'],
        ['🇩', ':regional_indicator_d:'],
        ['🇪', ':regional_indicator_e:'],
        ['🇫', ':regional_indicator_f:'],
        ['🇬', ':regional_indicator_g:'],
        ['🇭', ':regional_indicator_h:'],
        ['🇮', ':regional_indicator_i:'],
        ['🇯', ':regional_indicator_j:'],
        ['🇰', ':regional_indicator_k:'],
        ['🇱', ':regional_indicator_l:'],
        ['🇲', ':regional_indicator_m:'],
        ['🇳', ':regional_indicator_n:'],
        ['🇴', ':regional_indicator_o:'],
        ['🇵', ':regional_indicator_p:'],
        ['🇶', ':regional_indicator_q:'],
        ['🇷', ':regional_indicator_r:'],
        ['🇸', ':regional_indicator_s:'],
        ['🇹', ':regional_indicator_t:'],
        ['🇺', ':regional_indicator_u:'],
        ['🇻', ':regional_indicator_v:'],
        ['🇼', ':regional_indicator_w:'],
        ['🇽', ':regional_indicator_x:'],
        ['🇾', ':regional_indicator_y:'],
        ['🇿', ':regional_indicator_z:']
    ]);

    public static async parse(message: Message, input: string, type: EmojiType = 'all'): Promise<string | Emoji> {
        if (!input)
            throw CommandError.syntax('EmojiArgument', 'No input provided');

        if (emoji.hasEmoji(input)) {
            const withColons: string = emoji.unemojify(input);

            if (withColons.split('').filter(character => character === ':').length === 2 && withColons.startsWith(':') && withColons.endsWith(':')) {
                if (type === 'custom')
                    throw CommandError.syntax('EmojiArgument', 'Required type custom but input is of type unicode');

                return withColons;
            } else {
                throw CommandError.syntax('EmojiArgument', `Expected unicode emoji but got \`${input.replaceAll('`', '')}\` instead`);
            }
        }

        if (this.regionalIndicators.has(input)) {
            if (type === 'custom')
                throw CommandError.syntax('EmojiArgument', 'Required type custom but input is of type unicode');

            return this.regionalIndicators.get(input);
        }

        if (type === 'unicode')
            throw CommandError.syntax('EmojiArgument', `Required type ${type} but got \`${input.replaceAll('`', '')}\` instead`);

        const match: RegExpMatchArray = this.regex('EmojiArgument', /^<a?:(.*):(\d*)>$/, input);
        const parsed: DeconstructedSnowflake = SnowflakeUtil.deconstruct(match[2]);

        if (parsed.timestamp < SnowflakeUtil.EPOCH)
            throw CommandError.syntax('EmojiArgument', `Expected snowflake but got ${match[1].replaceAll('`', '')} instead`);

        return (await message.guild.fetch()).emojis.resolve(match[2]);
    }
}