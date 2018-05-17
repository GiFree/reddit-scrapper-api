import { redditScrapper } from './redditScrapper';

// DO NOT USE



const options = {
  numOfImages: 33,
  subReddit: 'ImaginaryLandscapes',
};
console.log('START');
redditScrapper(options)
  .then((images: any) => {
    (console.log(images.length))
  })
