import { Message } from 'discord.js';
import { ArgumentError } from '../argumentError';

export class BooleanArgument {

    public static async parse(message: Message, input: string): Promise<boolean> {
        if (!input)
            throw new ArgumentError('BooleanArgument: No input provided');

        if (input === 'true')
            return true;

        if (input === 'false')
            return false;

        throw new ArgumentError(`BooleanArgument: Invalid format (expected true or false emoji, got \`${input.replaceAll('`', '')}\`)`);
    }
}