import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { config, primaryColor } from '.';
import { Argument } from './argument';

export abstract class Command {

    public abstract name(): string;
    public abstract description(): string;
    public abstract arguments(): Array<Argument>;

    public help(): MessageEmbed {
        const embed: MessageEmbed = new MessageEmbed()
            .setTitle(config.discord.commandPrefix + this.name())
            .setColor(primaryColor)
            .setDescription(this.description());

        for (const argument of this.arguments())
            embed.addField(`${argument.name}: ${argument.type}`, argument.description, true);

        return embed;
    }

    public abstract permitted(member: GuildMember): Promise<boolean>;
    public abstract handle(message: Message, args: Array<string>): Promise<void>;
}