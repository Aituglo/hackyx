import { fetchContentFromURL } from './parsers/default';
import { parseHackeroneContent } from './parsers/hackerone';
import { contentExists } from './typesense';

export async function parseContentFromURL(url: string): Promise<{ title: string; content: string } | null> {
    const exists = await contentExists(url);
    if (exists) {
        console.log('Content already exists in Hackyx.');
        return null;
    }

    if (url.includes('hackerone.com')) {
        return parseHackeroneContent(url);
    } else {
        return fetchContentFromURL(url);
    }
}
