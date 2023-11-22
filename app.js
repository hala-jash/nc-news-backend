const express = require('express');
const app = express();
const {
  handlePsqlErrors,
  handleCustomErrors,
  handle404,
  handle500,
} = require('./errorHandle');
const { getTopics } = require('./controller/topicController');
const { getApis } = require('./controller/apiController');
const { getArticleById } = require('./controller/articlesController');
const { getArticles } = require('./controller/articlesController');
const { getArticleComments} = require('./controller/articlesController');
const { postArticleComments } = require('./controller/articlesController');

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getApis)

app.get('/api/articles', getArticles);

app.get("/api/articles/:article_id",getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComments);

app.all('*',handle404)
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500);



module.exports = app;