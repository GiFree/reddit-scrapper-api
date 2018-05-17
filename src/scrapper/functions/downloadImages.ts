import fetch from 'node-fetch';
import * as fse from 'fs-extra';
import * as md5 from 'md5';
import * as fileType from 'file-type';
import { Image, ScrapParams } from '../redditScrapper';

export const downloadImages = (images: Image[], options: ScrapParams) => {
  // download all images

  return fse.ensureDir(`./public/${options.subReddit}`)
    .then(() => {
      return images.map((image) => {
        return fetch(image.href)
          .then(res => res.buffer())
          .then((buffer) => {
            const type = fileType(buffer);
            const name = md5(buffer);
            const filePath = `./public/${options.subReddit}/${name}.${type.ext}`;

            return fse.outputFile(filePath, buffer)
              .then(() => {
                return {
                  title: image.title,
                  postLink: image.postLink,
                  extension: type.ext,
                  hash: name,
                  category: options.subReddit
                };
              })
              .catch((err) => {
                throw new Error(err.message);
              })

          })
          .catch((err) => {
            throw new Error(err.message)
          })
      })
    })
    .catch((err) => {
      throw new Error(err.message);
    })

};