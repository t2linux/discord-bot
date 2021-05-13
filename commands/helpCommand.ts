import { GuildMember, Message } from 'discord.js';
import { commands } from '..';
import { Argument } from '../argument';
import { Command } from '../command';

export class HelpCommand extends Command {

    public name(): string {
        return 'help';
    }

    public description(): string {
        return 'Help about a command';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'command', type: 'string', description: 'The command to get help about' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return true;
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        const [ commandName ] = args;

        for (const command of commands) {
            if (command.name().toLowerCase() === commandName.toLowerCase()) {
                message.channel.send(command.help());

                return;
            }
        }

        message.channel.send('Command not found');
    }
}