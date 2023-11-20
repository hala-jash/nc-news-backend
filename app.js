const express = require('express');
const app = express();
const {
  handlePsqlErrors,
  handleCustomErrors,
  handle404,
  handle500,
  handleUnhandledErrors,
} = require('./errorHandle');
const { getTopics } = require('./controller/topicController');


app.use(express.json());

app.get('/api/topics', getTopics);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle404);
app.use(handle500);
app.use(handleUnhandledErrors);


module.exports = app;