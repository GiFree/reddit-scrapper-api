import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Sequelize from 'sequelize';
import * as cors from 'cors';
import { redditScrapper } from './scrapper/redditScrapper';
import { sequelizeConfig } from './config';
import { Image as ImageModelFunc } from './models/ImageModel';
const app = express();

// Sequelize configuration
const sequelize = new Sequelize(sequelizeConfig);

interface Image {
  title: string;
  href: string;
  extension?: string;
  hash?: string;
  postLink?: string;
}

export const ImageModel = ImageModelFunc(sequelize, Sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log('authenticated successfully');
    ImageModel.findAll()
      .then(() => {
        sequelize.sync();
      })
      .catch((err) => {
        sequelize.sync({ force: true });
      })
  })
  .catch((err) => {
    console.error('unable to connect to database:', err);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

import { listAll, listCategory } from './routes/list';
import { download } from './routes/download';
import { deleteRoute } from './routes/delete';

app.get('/list', listAll);
app.get('/list/:category', listCategory);

app.post('/download', download);
// delete all images from specify category
app.post('/delete', deleteRoute)


app.post('/clear', (req, res, next) => {
  ImageModel.sync({ force: true });
}) // TO BE REMOVED

app.post('/valid', (req, res, next) => {
  ImageModel.destroy({
    where: {
      hash: null,
    },
  })
    .then((affectedRows) => {
      res.send({ affectedRows });
    })
    .catch((err) => {
      res.send({ error: err.message });
    })
}); // TO BE REMOVED


// Handle 404 redirection
app.get('/*', (req, res, next) => {
  res.send("404 Not Found");
})

app.listen(3001).on('listening', () => {
  console.log('Server stardet at port 3000');
});
