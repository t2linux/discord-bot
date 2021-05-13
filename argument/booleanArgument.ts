import { Message } from 'discord.js';
import { ArgumentError } from '../argumentError';

export class BooleanArgument {

    public static async parse(message: Message, input: string): Promise<boolean> {
        if (!input)
            throw ArgumentError.syntax('BooleanArgument', 'No input provided');

        if (input === 'true')
            return true;

        if (input === 'false')
            return false;

        throw ArgumentError.syntax('BooleanArgument', `Expected true or false emoji but got \`${input.replaceAll('`', '')}\` instead`);
    }
}