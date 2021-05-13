import { Message } from 'discord.js';
import { CommandError } from '../commandError';

export class BooleanArgument {

    public static async parse(input: string): Promise<boolean> {
        if (!input)
            throw CommandError.syntax('BooleanArgument', 'No input provided');

        if (input === 'true')
            return true;

        if (input === 'false')
            return false;

        throw CommandError.syntax('BooleanArgument', `Expected true or false emoji but got \`${input.replaceAll('`', '')}\` instead`);
    }
}