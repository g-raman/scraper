import puppeteer, { Browser, Page } from 'puppeteer';
import { NUM_YEARS, PUPPETEER_ARGS, URL } from './utils/constants';
import setSearchOptions from './setSearchOptions';
import scrapeSearchResults from './scrapeSearchResults';
import pLimit from 'p-limit';
import logHeader from './utils/logHeader';
import getAvailableCourses from './utils/getAvailableCourses';
import getAvailableTerms from './utils/getAvailableTerms';

async function main() {
  logHeader('Pre-Scrape');
  const terms = await getAvailableTerms();
  const courses = await getAvailableCourses();

  logHeader('Scraping', true);
  console.log('Launching puppeteer...');
  const browser: Browser = await puppeteer.launch({ args: PUPPETEER_ARGS });
  const page: Page = await browser.newPage();
  console.log('Puppeteer started');

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });

  const start = performance.now();
  const limit = pLimit(1);
  await page.goto(URL, { waitUntil: 'networkidle2' });
  for (let i = 0; i < terms.length; i++) {
    logHeader(`Scraping for courses in ${terms[i].term}`, true);
    for (let j = 15; j < courses.length; j++) {
      console.log(`Attempting search for ${courses[j]}`);
      for (let k = 1; k <= NUM_YEARS; k++) {
        console.log(`Year: ${k}`);
        const queue = [
          limit((j, k, i) => setSearchOptions(page, courses[j], k, terms[i]), j, k, i),
          limit(() => page.waitForNetworkIdle({ concurrency: 1 })),
          limit(async () => {
            const message = await page.$('.SSSMSGALERTTEXT');
            if (message) {
              const error = await message.evaluate((elem) => elem.innerText);
              throw new Error(error);
            }
          }),
          limit((i) => scrapeSearchResults(page, terms[i].term), i),
          limit(() => page.waitForNetworkIdle({ concurrency: 1 })),
        ];

        try {
          await Promise.all(queue);
        } catch (error) {
          console.log(error + '\n');
          continue;
        }
        console.log();
      }
    }
  }

  page.close();
  browser.close();
  const end = performance.now();
  console.log(`Time: ${end - start}`);
}

main();
