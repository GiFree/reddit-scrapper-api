import { ImageModel } from '../server';

export const deleteRoute = (req, res, next) => {
  ImageModel.destroy({
    where: {
      category: req.body.category
    }
  })
    .then((affectedRows) => {
      if (affectedRows > 0) {
        res.send({ message: `Deleted ${affectedRows} images` });
      } else {
        res.send({ message: 'None images with that category found!' })
      }
    })
    .catch((err) => {
      res.send({ message: err.message });
    })

}