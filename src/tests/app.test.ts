import { seedData } from './seed';
import app, { ImageModel } from '../app';
import * as request from 'supertest';

const seed = async () => {
  await ImageModel.sync({ force: true });
  return await Promise.all(seedData.map((image) => {
    return ImageModel.create(image);
  }));

};

describe('Test the "/" path', () => {
  test('It should response the GET method with error 404', (done) => {
    return request(app)
      .get('/')
      .expect(404, done);
  });
});

// listRoute
describe('Test the "/list" path', () => {
  test('It should response the GET method', (done) => {
    return request(app)
      .get('/list')
      .expect(200)
      .then((res) => {
        expect(res.body.response).toBeInstanceOf(Array);
        done();
      });
  });

});

describe('Test the "/list:category" path for category 1', () => {

  test('It should response with element with length property equal to 3', (done) => {
    seed()
      .then(() => {
        request(app)
          .get('/list/1')
          .expect(200)
          .then((res) => {
            expect(res.body.response).toHaveLength(3);
            done();
          });
      });
  });
});

// DELETE.TS
describe('Test the /delete post request', () => {
  test('response with "Deleted 5 images"', (done) => {
    seed()
      .then(() => {
        request(app)
          .post('/delete')
          .send({ category: '2' })
          .expect(200)
          .then((res) => {
            expect(res.body.message).toBe(`Deleted 5 images`);
            done();
          });

      });
  });

  test('response with "None images with that category found!"', (done) => {
    request(app)
      .post('/delete')
      .send({ category: 'dsaikudb0as8b' })
      .expect(200)
      .then((res) => {
        expect(res.body.message).toBe('None images with that category found!');
        done();
      });
  });
});

// downloadRoute
describe('Test the /download request', () => {
  test('It returns error when no data posted', (done) => {
    request(app)
      .post('/download')
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Please post valid data!');
        done();
      });
  });

});
