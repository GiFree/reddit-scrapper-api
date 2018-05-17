const Image = (sequelize, DataTypes) => {

  const ImageModel = sequelize.define('image', {
    title: {
      type: DataTypes.STRING,
    },
    postLink: {
      type: DataTypes.STRING,
    },
    extension: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
    }
  });

  return ImageModel;
}

export { Image };
