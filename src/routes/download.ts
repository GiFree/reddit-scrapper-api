import { ImageModel } from '../app';
import { redditScrapper } from '../scrapper/redditScrapper';


export const download = (req, res, next) => {
  if (req.body.numOfImages && req.body.subReddit) {
    const options = {
      numOfImages: req.body.numOfImages,
      subReddit: req.body.subReddit,
      screenshot: false,
    };

    redditScrapper(options)
      .then((images) => {
        //HANDLE IMAGES
        const processed = images.map((image) => {
          console.log(image)
          ImageModel.create(image)
            .then(() => {
              return true;
            })
            .catch((err) => {
              return false;
            })
        })
        Promise.all(processed)
          .then(() => {
            return res.send({ message: 'Processing done!' });
          })
          .catch((err) => {
            return res.status(503).send({ message: err.message });
          })

      })
      .catch((err) => {
        return res.status(503).send({ message: err.message });
      });

  } else {
    return res.status(400).send({ message: 'Please post valid data!' });
  }
} 