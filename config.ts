import { CommandoClientOptions } from 'discord.js-commando';

export interface Config {
    discord: {
        token: string;
        options: CommandoClientOptions;
    };
}