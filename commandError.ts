import { APIMessageContentResolvable, MessageAdditions, MessageEmbed, MessageOptions } from 'discord.js';
import { Color } from './color';

export class CommandError extends Error {

    public constructor(public readonly content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions) {
        super();
    }

    private static error(prefix: string, commandName: string, message: string): CommandError {
        return new CommandError(new MessageEmbed()
            .setColor(Color.red)
            .setTitle(commandName)
            .setDescription(`${prefix}: ${message}`));
    }

    public static syntax(commandName: string, message: string): CommandError {
        return this.error('SyntaxError', commandName, message);
    }

    public static semantic(commandName: string, message: string): CommandError {
        return this.error('SemanticError', commandName, message);
    }

    public static generic(commandName: string, message: string): CommandError {
        return this.error('Error', commandName, message);
    }
}