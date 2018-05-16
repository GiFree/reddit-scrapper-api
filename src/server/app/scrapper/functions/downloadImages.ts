import fetch from 'node-fetch';
import * as fs from 'fs';
import * as md5 from 'md5';
import * as fileType from 'file-type';
import { Image, ScrapParams } from '../redditScrapper';

export const downloadImages = (images: Image[], options: ScrapParams, handleImage) => {
  // download all images

  // create directory if not exists
  fs.readdir('./public/', (err, files) => {
    if (err) throw new Error(`error reading dir`);
    if (!files.includes(options.subReddit)) {
      fs.mkdirSync(`./public/${options.subReddit}`);
    }
    // iterate over all images and fetch them
    images.map((image, index) => {
      fetch(image.href)
        .then((res) => res.buffer())
        .then((buffer) => {
          const type = fileType(buffer);
          const name = md5(buffer);
          const filePath = `./public/${options.subReddit}/${name}.${type.ext}`;

          fs.writeFile(filePath, buffer, (err) => {
            if (err) {
              throw new Error(err.message);
            } else {
              // execute handleImage as callback - saving to database
              if (image && type.ext && image.title && image.href && name && options.subReddit) {
                handleImage({
                  title: image.title,
                  postLink: image.postLink,
                  extension: type.ext,
                  hash: name,
                  category: options.subReddit,
                });
              }
            }
          })
        });
    });
  });
};