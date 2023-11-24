const express = require('express');
const app = express();
const {
  handlePsqlErrors,
  handleCustomErrors,
  handle404,
  handle500,
} = require('./errorHandle');

const topicsRouter = require('./routes/topic-router-js');
const articleRouter = require('./routes/articles-router');
const commentsRouter = require('./routes/comments-router');
const apiRouter = require('./routes/api-router');
const userRouter = require('./routes/user-router');

app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/articles', articleRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', userRouter);

app.all('*', handle404);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500);

module.exports = app;
