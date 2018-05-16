import { redditScrapper } from './redditScrapper';

// DO NOT USE



const options = {
  numOfImages: 57,
  subReddit: 'memes',
};
console.log('START');
redditScrapper(options, (image) => {
  console.log(image);
});
