const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const data = require('../db/data/test-data');
const jsonFile = require('../endpoints.json')

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
    
});

describe('error handling()', () => {
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
    test("return Json object with all apis endpoint in file ", ()=>{
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          console.log(body.dataApi)
          expect(body.dataApi).toEqual(jsonFile)
      })
   })
  })