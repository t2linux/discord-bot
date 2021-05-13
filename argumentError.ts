import { APIMessageContentResolvable, MessageAdditions, MessageEmbed, MessageOptions } from 'discord.js';
import { Color } from './color';

export class ArgumentError extends Error {

    public constructor(public readonly content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions) {
        super();
    }

    public static syntax(name: string, message: string): ArgumentError {
        return new ArgumentError(new MessageEmbed()
            .setColor(Color.red)
            .setTitle(name)
            .setDescription('SyntaxError: ' + message));
    }
}