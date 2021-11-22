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
        [['fedora'], 'https://wiki.t2linux.org/distributions/fedora/installation/'],
        [['manjaro'], 'https://wiki.t2linux.org/distributions/manjaro/installation/'],
        [['ubuntu'], 'https://wiki.t2linux.org/distributions/ubuntu/installation/'],
        [['uninstall'], 'https://wiki.t2linux.org/guides/uninstall/'],
        [['kernel'], 'https://wiki.t2linux.org/guides/kernel/'],
        [['startup'], 'https://wiki.t2linux.org/guides/startup-manager/'],
        [['refind'], 'https://wiki.t2linux.org/guides/refind/'],
        [['state'], 'https://wiki.t2linux.org/state/']
    ]);

    public name(): string {
        return 'wiki';
    }

    public description(): string {
        return 'Sends the link to a given wiki article';
    }

    public arguments(): Array<Argument> {
        return [
            { name: 'name', type: '"list" | [...]article name[...]', description: 'The name of the article to be linked' }
        ];
    }

    public async permitted(member: GuildMember): Promise<boolean> {
        return true;
    }

    public async handle(message: Message, args: Array<string>): Promise<void> {
        if (args[0] === 'list') {
            const embed = new MessageEmbed()
                .setColor(Color.primary)
                .setDescription('List of articles for .wiki');

            Array.from(WikiCommand.articles.entries()).forEach(entry => embed.addField(entry[0].join(', '), entry[1], true));

            message.channel.send(embed);
        } else {
            const found: Array<{ name: string, url: string }> = new Array<{ name: string, url: string }>();

            for (let i = 0; i < args.length; i++) {
                const argument: Array<string> = args.slice(i);

                for (const keys of WikiCommand.articles.keys()) {
                    for (const key of keys) {
                        const words: Array<string> = key.split(' ');

                        let matchesWords: boolean = true;

                        for (let i = 0; i < words.length; i++) {
                            if (argument[i].toLowerCase() !== words[i].toLowerCase()) {
                                matchesWords = false;

                                break;
                            }
                        }

                        if (matchesWords)
                            found.push({ name: key, url: WikiCommand.articles.get(keys) });
                    }
                }
            }

            if (found.length === 0)
                throw CommandError.generic('WikiCommand', 'The message did not contain any article names, use `.wiki list` to see all articles');

            const embed: MessageEmbed = new MessageEmbed()
                .setColor(Color.primary)
                .setFooter('Use ".wiki list" for all articles');

            for (const entry of found)
                embed.addField(entry.name, entry.url, true);

            message.channel.send(embed);
        }
    }
}