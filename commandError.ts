import { APIMessageContentResolvable, MessageAdditions, MessageEmbed, MessageOptions } from 'discord.js';
import { Color } from './color';

export class CommandError extends Error {

    public constructor(public readonly content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions) {
        super();
    }

    public static syntax(commandName: string, message: string): CommandError {
        return new CommandError(new MessageEmbed()
            .setColor(Color.red)
            .setTitle(commandName)
            .setDescription('SyntaxError: ' + message));
    }

    public static generic(commandName: string, message: string): CommandError {
        return new CommandError(new MessageEmbed()
            .setColor(Color.red)
            .setTitle(commandName)
            .setDescription('Error: ' + message));
    }
}