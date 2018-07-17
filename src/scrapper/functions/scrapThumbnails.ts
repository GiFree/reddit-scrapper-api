import * as puppeteer from 'puppeteer';

import { Image, ScrapParams } from '../redditScrapper';


/* tslint:disable-next-line max-line-length */
export const scrapThumbnails = async (params: ScrapParams, browser: puppeteer.Browser, page: puppeteer.Page) => {
  // wait few seconds for reddit to load next posts
  setTimeout(() => { }, 5000);

  await page.waitForSelector('img.media-element');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  let images: Image[] = [];



  // collect image titles and hrefs from page
  const evaluatedData: Image[] = await page.evaluate((param) => {
    // BROWSER CODE -- start

    const elements = Array.from(document.querySelectorAll('img.media-element'));

    return elements.map((post: HTMLImageElement) => {
      const href = post.src;
      const parent: any = post.parentElement.parentElement.parentElement;
      const title = parent.href.split('/')[7].split('_').join(' ');
      const postLink = parent.href;
      post.className = '.done';
      return { title, href, postLink };
    });

    // BROWSER CODE -- end

    /* tslint:disable-next-line align */
  }, params);

  images = images.concat(evaluatedData);

  if (images.length > params.numOfImages) {
    images.splice(params.numOfImages);

  } else if (images.length < params.numOfImages) {

    params.collectedAmount = images.length;
    params.numOfImages = params.numOfImages - images.length;

    images = images.concat(await scrapThumbnails(params, browser, page));
  }

  return images;
};
