import { ImageModel } from '../app';

export const deleteRoute = async (req, res, next) => {
  if (!req.body.category) {
    return res.status(400).send({ message: 'Please post valid data!' });
  }

  const affectedRows = await ImageModel.destroy({
    where: {
      category: req.body.category,
    },
  });

  if (affectedRows > 0) {
    return res.send({ message: `Deleted ${affectedRows} images` });
  }

  return res.send({ message: 'None images with that category found!' });

};
