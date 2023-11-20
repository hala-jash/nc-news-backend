const express = require('express');
const app = express();
const { handle404 } = require('./errorHandle');
const { getTopics } = require('./controller/topicController');


app.get('/api/topics', getTopics);

app.all('*',handle404)

module.exports = app;
