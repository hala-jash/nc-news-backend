const express = require('express');
const app = express();
const { handle404 } = require('./errorHandle');
const { getTopics } = require('./controller/topicController');

app.use(express.json());

app.get('/api/topics', getTopics);

app.use(handle404);

module.exports = app;
