import { firefox } from 'playwright';
import { JSDOM } from 'jsdom';

export async function parseHackeroneContent(url: string): Promise<string | null> {
    const browser = await firefox.connect(process.env.BROWSERLESS_URL);
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'networkidle' });

        // Wait for the content to be loaded dynamically
        await page.waitForTimeout(3000);

        const content = await page.content();
        const dom = new JSDOM(content);
        const document = dom.window.document;

        let finalText = '';

        const summaries = document.querySelectorAll('div.report-summary');
        const reportInformation = document.querySelector('div#report-information');

        summaries.forEach(summary => {
            finalText += summary.textContent.trim() + ' ';
        });

        if (reportInformation) {
            finalText += reportInformation.textContent.trim();
        }

        finalText = finalText.replace(/MenuMenu/g, ' ');

        return finalText;
    } catch (error) {
        console.error('Error parsing HackerOne content:', error);
        return null;
    } finally {
        await browser.close();
    }
}
