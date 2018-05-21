import { ImageModel } from '../app';


export const listAll = (req, res, next) => {
  ImageModel.findAll()
    .then((images) => {
      res.send({
        response: images.map((image) => {
          return {
            title: image.title,
            postLink: image.postLink,
            extension: image.extension,
            hash: image.hash,
            category: image.category
          }
        })
      });
    })
    .catch((err) => {
      res.status(503).send({ error: err.message });
    })
}

export const listCategory = (req, res, next) => {
  ImageModel.findAll({
    where: {
      category: req.params.category
    }
  })
    .then((images) => {

      res.send({
        response: images.map((image) => {
          return {
            title: image.title,
            postLink: image.postLink,
            extension: image.extension,
            hash: image.hash,
            categoty: image.category
          }
        })
      });
    })
    .catch((err) => {
      res.status(503).send({ error: err.message });
    })
}