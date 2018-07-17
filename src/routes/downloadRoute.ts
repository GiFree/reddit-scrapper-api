import { ImageModel } from '../app';
import { redditScrapper } from '../scrapper/redditScrapper';


export const downloadRoute = async (req, res, next) => {
  if (!req.body.numOfImages || !req.body.subReddit) {
    return res.status(400).send({ message: 'Please post valid data!' });
  }

  const options = {
    numOfImages: req.body.numOfImages,
    subReddit: req.body.subReddit,
    screenshot: false,
  };

  const images = await redditScrapper(options);


  // HANDLE IMAGES
  const processed = images.map((image) => {
    console.log(image);
    ImageModel.create(image)
      .then(() => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  });

  await Promise.all(processed);

  return res.send({ message: 'Processing done!' });
};
