import { ArgumentError } from '../argumentError';

export class RegexBasedArgument {

    protected static regex(name: string, pattern: RegExp, input: string): RegExpMatchArray {
        if (!input)
            console.log(`${name}: No input provided`);

        const match: RegExpMatchArray | null = input.match(pattern);

        if (!match)
            throw new ArgumentError(`${name}: Invalid format (expected \`${pattern}\` but got \`${input.replaceAll('`', '')}\` instead)`);

        return match;
    }
}