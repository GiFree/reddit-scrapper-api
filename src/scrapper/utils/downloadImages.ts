import nodeFetch from 'node-fetch';
import * as fse from 'fs-extra';
import * as md5 from 'md5';
import * as fileType from 'file-type';
import { Image, ScrapParams } from '../redditScrapper';

export const downloadImages = async (images: Image[], options: ScrapParams) => {
  // download all images
  await fse.ensureDir(`./public/${options.subReddit}`);
  return images.map(async (image) => {
    const buffer = await nodeFetch(image.href).then(res => res.buffer());

    const type = fileType(buffer); // Get file extension
    const name = md5(buffer);      // Get file hash - we use it as a fileName
    const filePath = `./public/${options.subReddit}/${name}.${type.ext}`;

    await fse.outputFile(filePath, buffer);

    return {
      title: image.title,
      postLink: image.postLink,
      extension: type.ext,
      hash: name,
      category: options.subReddit,
    };

  });


};
