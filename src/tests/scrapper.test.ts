import { redditScrapper } from '../scrapper/redditScrapper';
import { downloadImages } from '../scrapper/functions/downloadImages';
import { scrapThumbnails } from '../scrapper/functions/scrapThumbnails';
import * as fse from 'fs-extra';
import * as puppeteer from 'puppeteer';

const options = {
  numOfImages: 2,
  subReddit: 'memes',
  screenshot: false,
}

const images = [
  {
    title: 'image1',
    href: 'https://vignette.wikia.nocookie.net/arianagrande/images/7/70/Example.png/revision/latest?cb=20160301231046'
  },
  {
    title: 'image2',
    href: 'http://www.for-example.org/img/main/forexamplelogo.png'
  },

]

// set JEST timeout to 10 seconds as scrapThumbnails has its own 5 sec timeout
jest.setTimeout(350000);

describe('Test downloadImages', () => {
  test('saves images to files', (done) => {
    downloadImages(images, options)
      .then((array) => {
        Promise.all(array)
          .then(() => {
            fse.readdir(`./public/${options.subReddit}`)
              .then((res) => {
                expect(res).toHaveLength(2);
                done();
              })
          })
      })
  })
})

describe('Test scrapThumbnails', () => {
  test('It returns images objects with title, href, postLink', (done) => {
    (async () => {
      const browser = await puppeteer.launch();

      const page = await browser.newPage();
      await page.goto(`https://reddit.com/r/${options.subReddit}/`);

      scrapThumbnails(options, browser, page)
        .then((images) => {
          images.map((image) => {
            expect(image).toHaveProperty('title');
            expect(image).toHaveProperty('href');
            expect(image).toHaveProperty('postLink');
          });
          browser.close();
          done();
        })
    })();
  })
})