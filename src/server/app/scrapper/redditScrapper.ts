import * as puppeteer from 'puppeteer';
import { scrapThumbnails } from './functions/scrapThumbnails';
import { downloadImages } from './functions/downloadImages';

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

interface EvaluateData {
  images: Image[];
  nextPage: string;
}


const redditScrapper = async (options) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto(`https://reddit.com/r/${options.subReddit}/`);

  return scrapThumbnails(options, browser, page)
    .then((images) => {
      console.log('After sort: ', images.length);
      browser.close();
      console.log('download started');
      return downloadImages(images, options)
        .then((array) => {
          return Promise.all(array);
        })
    })
    .catch((err) => {
      browser.close();
      throw new Error(err.message);
    });
};

export { redditScrapper };
