import { APIMessageContentResolvable, MessageAdditions, MessageOptions } from 'discord.js';

export class ArgumentError extends Error {

    public constructor(public readonly content: APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions) {
        super();
    }
}