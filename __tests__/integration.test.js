const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const jsonFile = require('../endpoints.json');
const articles = require('../db/data/test-data/articles.js');

beforeAll(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
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

describe('GET /api', () => {
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

describe('GET /api/articles - default queries', () => {
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
          author: 'butter_bridge',
          body: 'One day I will be a great Coder leaving the world better with my coding skills',
          comment_id: expect.any(Number),
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

describe('PATCH /api/articles/:article_id', () => {
  test('responds status 200 if article updates by incrementing vote', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 101,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('responds status 200 if article updates by decrementing vote', () => {
    return request(app)
      .patch('/api/articles/4')
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 4,
          title: 'Student SUES Mitch!',
          topic: 'mitch',
          author: 'rogersop',
          body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
          created_at: '2020-05-06T01:14:00.000Z',
          votes: -100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('patch:404 sends a 404 + error message when valid votes but doesnt exist', () => {
    return request(app)
      .patch('/api/articles/1/comments')
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });

  test('patch :400 sends a 400 + error message when object request in invalid', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inco_votess: 1,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test("204: delete comment by it's comment_id", () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(({ body }) => {
        expect(body).toMatchObject({});
      });
  });

  test('delete:400 sends a 400 + error message when invalid id is provided', () => {
    return request(app)
      .delete('/api/comments/apple')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('delete:404 sends a 404 + error message when id is not found ', () => {
    return request(app)
      .delete('/api/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});
describe('GET /api/users', () => {
  test('Selecting all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        expect(body.users[0]).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  describe('error handling()', () => {
    test('returns an error with invalid endpoint', () => {
      return request(app)
        .get('/api/user')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not Found');
        });
    });
  });
});
describe('GET /api/articles (topic query)', () => {
  test('200:Selecting all topics with valid topic query', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test('200: Return [] with valid topic query but no article with this query', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
        expect(body.articles).toEqual([]);
      });
  });
  test('200: Return all article with ommitted topic query', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});
describe('404: error handling invalid endpoints', () => {
  test('returns an error with invalid article endpoint', () => {
    return request(app)
      .get('/api/banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('get /api/articles/:article_id adding comment_count', () => {
  test('respond with a 200 status code with an individual article object with CommentCount ', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          comment_count: expect.any(String),
        });
      });
  });
});

describe('GET /api/articles sort_by queries', () => {
  test('Selecting all Articles with votes', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles).toBeSortedBy('author', { descending: true });
      });
  });
});

describe('GET /api/users/:username', () => {
  test('respond with a 200 status code with an individual user object ', () => {
    return request(app)
      .get('/api/users/icellusedkars')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });
  test('GET:404 sends an appropriate status and error message when given a valid but non-existent username', () => {
    return request(app)
      .get('/api/users/Rainy')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('GET:400 sends an appropriate status and error message when username is invalid', () => {
    return request(app)
      .get('/api/users/3')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('responds status 200 if comments updates by incrementing vote', () => {
    return request(app)
      .patch('/api/comments/3')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 3,
          body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
          article_id: 1,
          author: 'icellusedkars',
          votes: 101,
          created_at: '2020-03-01T01:13:00.000Z',
        });
      });
  });
  test('responds status 200 if comments updates by decrementing vote', () => {
    return request(app)
      .patch('/api/comments/4')
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 4,
          body: ' I carry a log — yes. Is it funny to you? It is not to me.',
          article_id: 1,
          author: 'icellusedkars',
          votes: -200,
          created_at: '2020-02-23T12:01:00.000Z',
        });
      });
  });

  test('patch:404 error message when valid object but no votes', () => {
    return request(app)
      .patch('/api/comments/1/comments')
      .send({
        inc_votes: 1,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});

describe('post:/api/articles', () => {
  test('POST:201 insert article sends back new article to client', () => {
    const newArticle = {
      title: 'Hala',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'ADVANCED: POST /api/articles',
      article_img_url:
        'https://contentstatic.techgig.com/photo/86001236/coding-for-students-learn-with-these-7-apps.jpg?10556',
    };
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 14,
          title: 'Hala',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'ADVANCED: POST /api/articles',
          votes: 0,
          article_img_url:
            'https://contentstatic.techgig.com/photo/86001236/coding-for-students-learn-with-these-7-apps.jpg?10556',
        });
      });
  });
  test('POST:400 sends a 400 + error message when missing title provided', () => {
    return request(app)
      .post('/api/articles')
      .send({
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'ADVANCED: POST /api/articles',
        article_img_url:
          'https://contentstatic.techgig.com/photo/86001236/coding-for-students-learn-with-these-7-apps.jpg?10556',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('POST:404 sends a 404 + error message when valid title and author but dont exist', () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: 'Hala',
        topic: 'Lion',
        author: 'FUN-DAY',
        body: 'ADVANCED: POST /api/articles',
        article_img_url:
          'https://contentstatic.techgig.com/photo/86001236/coding-for-students-learn-with-these-7-apps.jpg?10556',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
});
describe('POST /api/topics', () => {
  test('POST:201 insert topics sends back new article to client', () => {
    const newTopic = {
      slug: 'Hala',
      description: 'Getting better at coding and debugging lallalala',
    };
    return request(app)
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then((response) => {
        expect(response.body.topic).toMatchObject({
         slug : 'Hala',
          description:'Getting better at coding and debugging lallalala',
        });
      });
  });
  test('POST:400 sends a 400 + error message when missing slug', () => {
    const newTopic = {
      description: 'Getting better at coding and debugging lallalala',
    };
    return request(app)
      .post('/api/topics')  
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test("204: delete article by it's article_id", () => {
    return request(app)
      .delete('/api/articles/4')
      .expect(204)
      .then(({ body }) => {
        expect(body).toMatchObject({});
      });
  });

  test('delete:400 sends a 400 + error message when invalid id is provided', () => {
    return request(app)
      .delete('/api/articles/apple')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });

  test('delete:404 sends a 404 + error message when id is not found ', () => {
    return request(app)
      .delete('/api/articles')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
})