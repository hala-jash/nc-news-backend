const express = require('express');
const app = express();
const { handle404 } = require('./errorHandle');
const { getTopics } = require('./controller/topicController');
const { getApis } = require('./controller/apiController');


app.get('/api/topics', getTopics);
app.get('/api', getApis)

app.all('*',handle404)

module.exports = app;
