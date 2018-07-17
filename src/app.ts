import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Sequelize from 'sequelize';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { sequelizeConfig } from './config';
import { Image as ImageModelFunc } from './models/ImageModel';
import routes from './routes';

export const app = express();

// Sequelize configuration
export const sequelize = new Sequelize(sequelizeConfig);

/* tslint:disable-next-line variable-name */
export const ImageModel = ImageModelFunc(sequelize, Sequelize);


app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// provide downloaded with scrapper images
// path: /subreddit/imageHash.extension
app.use(express.static('public'));

// handle all routes from ./routes/index
app.use('/', routes);

// Handle 404 redirection
app.get('*', (req, res, next) => {
  res.status(404).send('<h1>Not Found<h1>');
});

export default app;
