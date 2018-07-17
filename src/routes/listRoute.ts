import { ImageModel } from '../app';


export const listAllRoute = async (req, res, next) => {
  const images = await ImageModel.findAll();

  return res.status(200).send({
    response: images.map(image => ({
      title: image.title,
      postLink: image.postLink,
      extension: image.extension,
      hash: image.hash,
      category: image.category,
    })),
  });
};

export const listCategoryRoute = async (req, res, next) => {
  const images = await ImageModel.findAll({
    where: {
      category: req.params.category,
    },
  });

  return res.send({
    response: images.map(image => ({
      title: image.title,
      postLink: image.postLink,
      extension: image.extension,
      hash: image.hash,
      category: image.category,
    })),
  });
};
