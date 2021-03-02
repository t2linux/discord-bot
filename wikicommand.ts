import { MessageEmbed } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Data } from './data';

export class WikiCommand extends Command {
    private static articles: Map<Array<string>, string> = new Map<Array<string>, string>([
        [['wiki', 'index'], 'https://wiki.t2linux.org/'],
        [['wifi'], 'https://wiki.t2linux.org/guides/wifi/'],
        [['dkms', 'modules', 'drivers'], 'https://wiki.t2linux.org/guides/dkms/'],
        [['windows'], 'https://wiki.t2linux.org/guides/windows/'],
        [['audio'], 'https://wiki.t2linux.org/guides/audio-config/'],
        [['fan'], 'https://wiki.t2linux.org/guides/fan/'],
        [['arch'], 'https://wiki.t2linux.org/distributions/arch/installation/'],
        [['manjaro'], 'https://wiki.t2linux.org/distributions/manjaro/installation/'],
        [['ubuntu'], 'https://wiki.t2linux.org/distributions/ubuntu/installation/']
    ]);

    public constructor(client: CommandoClient, private data: Data) {
        super(client, {
            name: 'wiki',
            group: 'user',
            memberName: 'wiki',
            description: 'Sends the link to a given wiki article',
            args: [
                { key: 'name', type: 'string', prompt: 'Name of the wifi article', default: 'wiki' }
            ],
            ownerOnly: false,
            guildOnly: true
        });
    }

    public run(message: CommandoMessage, { name }): any {
        if (name === 'list') {
            const embed = new MessageEmbed()
                .setColor('#7663E8')
                .setDescription('List of articles for ".wiki <article>"')
                .setFooter('Use ".wiki list" to show this message');

            Array.from(WikiCommand.articles.entries()).forEach(entry => embed.addField(entry[0].join(', '), entry[1], true));

            message.channel.send(embed);
        } else {
            let found: { name: string, url: string } = null;

            for (const keys of WikiCommand.articles.keys())
                for (const key of keys)
                    if (key === name)
                        found = { name: key, url: WikiCommand.articles.get(keys) };

            if (found !== null) return message.channel.send(new MessageEmbed()
                .setColor('#7663E8')
                .addField(found.name, found.url, true)
                .setFooter('Use ".wiki list" for all articles'));

            message.channel.send(new MessageEmbed()
                .setColor('#7663E8')
                .setDescription('Article not found, use ".wiki list" for help'));
        }
    }
}