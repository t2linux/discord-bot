import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { Argument } from '../argument';
import { Color } from '../color';
import { Command } from '../command';
import { CommandError } from '../commandError';

export class WikiCommand extends Command {

    private static articles: Map<Array<string>, string> = new Map<Array<string>, string>([
        [['wiki', 'index'], 'https://wiki.t2linux.org/'],
        [['roadmap'], 'https://wiki.t2linux.org/roadmap/'],
        [['wifi'], 'https://wiki.t2linux.org/guides/wifi/'],
        [['dkms', 'modules', 'drivers'], 'https://wiki.t2linux.org/guides/dkms/'],
        [['windows'], 'https://wiki.t2linux.org/guides/windows/'],
        [['audio'], 'https://wiki.t2linux.org/guides/audio-config/'],
        [['hybrid graphics', 'igpu'], 'https://wiki.t2linux.org/guides/hybrid-graphics/'],
        [['fan'], 'https://wiki.t2linux.org/guides/fan/'],
        [['arch'], 'https://wiki.t2linux.org/distributions/arch/installation/'],
        [['manjaro'], 'https://wiki.t2linux.org/distributions/manjaro/installation/'],
        [['ubuntu'], 'https://wiki.t2linux.org/distributions/ubuntu/installation/'],
        [['uninstall'], 'https://wiki.t2linux.org/guides/uninstall/']
    ]);

    public name(): string {
        return 'wiki';
    }

    public description(): string {
        return 'Sends the link to a given wiki article';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'name', type: '"list" | ...string', description: 'The name of the article to be linked' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return true;
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        if (args[0] === 'list') {
            const embed = new MessageEmbed()
                .setColor(Color.primary)
                .setDescription('List of articles for ".wiki <article>"')
                .setFooter('Use ".wiki list" to show this message');

            Array.from(WikiCommand.articles.entries()).forEach(entry => embed.addField(entry[0].join(', '), entry[1], true));

            message.channel.send(embed);
        } else {
            let found: { name: string, url: string } = null;

            for (const keys of WikiCommand.articles.keys()) {
                for (const key of keys) {
                    const words: Array<string> = key.split(' ');

                    let matchesWords: boolean = true;

                    for (let i = 0; i < words.length; i++) {
                        if (args[i].toLowerCase() !== words[i].toLowerCase()) {
                            matchesWords = false;

                            break;
                        }
                    }

                    if (matchesWords)
                        found = { name: key, url: WikiCommand.articles.get(keys) };
                }
            }


            if (found === null)
                throw CommandError.generic('WikiCommand', 'Article not found, use `.wiki list` for a full list');

            message.channel.send(new MessageEmbed()
                .setColor(Color.red)
                .setDescription('Article not found, use ".wiki list" for help'));
        }
    }
}