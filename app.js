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
const { getArticleComments } = require('./controller/articlesController');
const { postArticleComments } = require('./controller/articlesController');
const { patchArticle } = require('./controller/articlesController');
const { deleteComment } = require('./controller/commentsController');
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getApis);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', postArticleComments);
app.patch('/api/articles/:article_id', patchArticle);
app.delete('/api/comments/:comment_id', deleteComment);

app.all('*', handle404);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
