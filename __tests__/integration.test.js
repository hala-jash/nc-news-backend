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
          slug: 'mitch',
          description: 'The man, the Mitch, the legend',
        });
      });
  });
  describe('error handling()', () => {
    test('returns an 404 error with invalid endpoint', () => {
      return request(app)
        .get('/api/topic')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
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
          article_img_url: expect.any(String),
        });
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('GET:400 sends an appropriate status and error message when article_id is invalid', () => {
    return request(app)
      .get('/api/articles/apple')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('selectArticles()', () => {
  test('Selecting all Articles with default date in DESC order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
      });
  });
  describe('404: error handling', () => {
    test('returns an 404 error with invalid endpoint', () => {
      return request(app)
        .get('/api/blah')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  test('respond with a 200 status code with an individual comment object ', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            votes: expect.any(Number),
          });
        });
      });
  });
  test('GET:400 sends an appropriate status and error message when article_id is invalid', () => {
    return request(app)
      .get('/api/articles/apple/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/200/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('200: responds with empty array if article_id exist but ther are no comments with the article_id', () => {
    return request(app)
      .get('/api/articles/10/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe('post:/api/articles/:article_id/comments', () => {
  test('POST:201 insert comment sends back new comment to client ', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'butter_bridge',
        body: 'One day I will be a great Coder leaving the world better with my coding skills',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: expect.any(String),
          body: expect.any(String),
        });
      });
  });
  test('POST:400 sends a 400 + error message when missing username provided', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        body: 'One day I will be a great Coder leaving the world better with my coding skills',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('POST:404 sends a 404 + error message when valid username but doesnt exist', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'hala-code',
        body: 'One day I will be a great Coder leaving the world better with my coding skills',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});
