import { CommandError } from '../../commandError';

export class RegexBasedArgument {

    protected static regex(name: string, pattern: RegExp, input: string): RegExpMatchArray {
        if (!input)
            throw CommandError.syntax(name, 'No input provided');

        const match: RegExpMatchArray | null = input.match(pattern);

        if (!match)
            throw CommandError.syntax(name, `Expected \`${pattern}\` but got \`${input.replaceAll('`', '')}\` instead`);

        return match;
    }
}