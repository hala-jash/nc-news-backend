const express = require('express');
const apiRouter = express.Router();
const { getApis } = require('../controller/apiController');

apiRouter.get('/', getApis);

module.exports = apiRouter;
