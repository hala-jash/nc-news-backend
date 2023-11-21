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

app.get('/api/topics', getTopics);
app.get('/api', getApis);
app.get('/api/articles/:article_id', getArticleById);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.all('*', handle404);
app.use(handle500);

module.exports = app;
