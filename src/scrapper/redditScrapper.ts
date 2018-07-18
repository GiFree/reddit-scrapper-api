import * as puppeteer from 'puppeteer';
import { scrapThumbnails } from './scrapThumbnails';
import { downloadImages } from './utils/downloadImages';

export interface ScrapParams {
  numOfImages: number;
  subReddit: string;
  collectedAmount?: number;
  href?: string;
}

export interface Image {
  title: string;
  href: string;
  postLink?: string;
  extension?: string;
  hash?: string;
}



const redditScrapper = async (options) => {

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(`https://reddit.com/r/${options.subReddit}/`);

  try {
    const images = await scrapThumbnails(options, browser, page);

    browser.close();

    return downloadImages(images, options)
      .then((array) => {
        return Promise.all(array);
      });

  } catch (err) {
    browser.close();
    throw new Error(err.message);
  }

};

export { redditScrapper };
