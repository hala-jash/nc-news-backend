const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const jsonFile = require('../endpoints.json');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('selectTopics()', () => {
  test('Selecting all Topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        expect(body.topics[0]).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
  });
});
describe('error handlingTopics()', () => {
  test('returns an error with invalid endpoint', () => {
    return request(app)
      .get('/api/topic')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});
describe('getApis()', () => {
  test('return Json object with all apis endpoint in file ', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body.dataApi).toEqual(jsonFile);
      });
  });
});

describe('/api/articles/:article_id', () => {
  test('respond with a 200 status code with an individual article object ', () => {
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          article_img_url:
          expect.any(String),
        });
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate status and error message when article_id is invalid', () => {
    return request(app)
      .get('/api/articles/apple')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });

});
