import { GuildMember, Message } from 'discord.js';

export abstract class Command {

    public abstract name(): string;
    public abstract description(): string;

    public abstract permitted(member: GuildMember): Promise<boolean>;
    public abstract handle(message: Message, args: Array<string>): Promise<void>;
}