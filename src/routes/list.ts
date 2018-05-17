import { ImageModel } from '../server';


export const listAll = (req, res, next) => {
  ImageModel.findAll()
    .then((images) => {
      res.send(images);
    })
    .catch((err) => {
      res.send({ error: err.message });
    })
}

export const listCategory = (req, res, next) => {
  ImageModel.findAll({
    where: {
      category: req.params.category
    }
  })
    .then((images) => {
      res.send(images);
    })
    .catch((err) => {
      res.send({ error: err.message });
    })
}