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

const ImageModel = ImageModelFunc(sequelize, Sequelize);

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

app.get('/list', (req, res, next) => {
  ImageModel.findAll()
    .then((images) => {
      res.send(images);
    })
    .catch((err) => {
      res.send({ error: err.message });
    })
});


app.get('/list/:category', (req, res, next) => {

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
});

// middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}) // CORS

app.post('/', (req, res, next) => {
  console.log(req.body);
  return next();
})

app.post('/download', (req, res, next) => {
  if (req.body.numOfImages && req.body.subReddit) {
    const options = {
      numOfImages: req.body.numOfImages,
      subReddit: req.body.subReddit,
      screenshot: false,
    };

    redditScrapper(options)
      .then((images) => {
        //HANDLE IMAGES
        const processed = images.map((image) => {
          console.log(image)
          ImageModel.create(image)
            .then(() => {
              return true;
            })
            .catch((err) => {
              return false;
            })
        })
        Promise.all(processed)
          .then(() => {
            return res.send({ message: 'Processing done!' });
          })
          .catch((err) => {
            return res.send({ message: err.message });
          })

      })
      .catch((err) => {
        return res.send({ message: err.message });
      });

  } else {
    return res.send({ message: 'Please post valid data!' });
  }


});

// delete all images from specify category
app.post('/delete', (req, res, next) => {
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

})

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
});


// Handle 404 redirection
app.get('/*', (req, res, next) => {
  res.send("404 Not Found");
})

app.listen(3001).on('listening', () => {
  console.log('Server stardet at port 3000');
});

app.post('/clear', (req, res, next) => {
  ImageModel.sync({ force: true });
})