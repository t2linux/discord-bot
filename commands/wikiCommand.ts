import { GuildMember, Message, MessageEmbed } from 'discord.js';
import { Command } from '../command';

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

    public async permitted(member: GuildMember): Promise<boolean> {
        return true;
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        if (args[0] === 'list') {
            const embed = new MessageEmbed()
                .setColor('#7663E8')
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


            if (found !== null) {
                message.channel.send(new MessageEmbed()
                    .setColor('#7663E8')
                    .addField(found.name, found.url, true)
                    .setFooter('Use ".wiki list" for all articles'));

                return;
            }

            message.channel.send(new MessageEmbed()
                .setColor('#7663E8')
                .setDescription('Article not found, use ".wiki list" for help'));
        }
    }
}