import { firefox } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function fetchContentFromURL(url: string): Promise<string | null> {
    const browser = await firefox.connect(process.env.BROWSERLESS_URL);
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        const content = await page.content();
        const dom = new JSDOM(content);
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        return article ? article.textContent : null;
    } catch (error) {
        // @ts-ignore
        console.error('Error fetching content:', error);
        return null;
    } finally {
        await browser.close();
    }
}
