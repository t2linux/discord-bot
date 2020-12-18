import * as files from 'fs';

interface Entry {
    channel: string;
    emoji: string;
    role: string;
}

export class Data {
    private entries: Array<Entry>;

    public constructor() {
        if (!files.existsSync('data.json')) {
            files.writeFileSync('data.json', '[]');
        }

        this.entries = JSON.parse(files.readFileSync('data.json').toString());
    }

    public hasChannel(channel: string): boolean {
        return this.entries.filter(entry => entry.channel === channel).length !== 0;
    }

    public hasEmoji(channel: string, emoji: string): boolean {
        return this.entries.filter(entry => entry.channel === channel && entry.emoji === emoji).length !== 0;
    }

    public getRole(channel: string, emoji: string): string {
        return this.entries.filter(entry => entry.channel === channel && entry.emoji === emoji)[0].role;
    }

    public removeEmoji(channel: string, emoji: string): void {
        this.entries = this.entries.filter(entry => !(entry.channel === channel && entry.emoji === emoji));

        files.writeFileSync('data.json', JSON.stringify(this.entries));
    }

    public addEmoji(channel: string, emoji: string, role: string): void {
        this.entries.push({
            channel,
            emoji,
            role
        });

        files.writeFileSync('data.json', JSON.stringify(this.entries));
    }
}