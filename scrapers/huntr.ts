import { firefox } from 'playwright';
import { JSDOM } from 'jsdom';
import { addContentToTypesense } from '@/lib/typesense';
import { fetchContentFromURL } from '@/lib/indexer';

function parseHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const reportsLink = document.querySelectorAll('a#report-link');
  const reports = Array.from(reportsLink).map(link => ({
    link: link.getAttribute('href'),
    title: link.textContent || ''
  }));
  return reports;
}

function getLastDate(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const rows = document.querySelectorAll('tr');
  const dates = Array.from(rows).slice(1).map(row => {
    const dateSpan = row.querySelector('td span');
    return dateSpan ? dateSpan.textContent : '';
  });
  return dates.length ? new Date(Math.min(...dates.map(date => new Date(date).getTime()))) : null;
}

export async function parseHacktivity() {
  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = "https://huntr.com/bounties/hacktivity";
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    let lastDate = '';

    while (await page.$('#show-more-button')) {
      await page.click('#show-more-button');
      const html = await page.content();
      const date = getLastDate(html);

      if (date && date.toString() === lastDate.toString()) {
        break;
      } else {
        lastDate = date;
      }
      await page.waitForTimeout(3000);
    }

    const finalHtml = await page.content();
    const reports = parseHtml(finalHtml);
    for (const report of reports) {
      const reportUrl = 'https://huntr.com' + report.link;
      const content = await fetchContentFromURL(reportUrl);
      if (content) {
        const success = await addContentToTypesense({
          url: reportUrl,
          content: content,
          title: report.title,
          source: 'Huntr'
        });
        if (success) {
          console.log(`Indexed ${reportUrl}`);
        } else {
          console.log(`Failed to index ${reportUrl}`);
        }
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}
