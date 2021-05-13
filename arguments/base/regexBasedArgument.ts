import { ArgumentError } from '../../argumentError';

export class RegexBasedArgument {

    protected static regex(name: string, pattern: RegExp, input: string): RegExpMatchArray {
        if (!input)
            throw ArgumentError.syntax(name, 'No input provided');

        const match: RegExpMatchArray | null = input.match(pattern);

        if (!match)
            throw ArgumentError.syntax(name, `Expected \`${pattern}\` but got \`${input.replaceAll('`', '')}\` instead)`);

        return match;
    }
}