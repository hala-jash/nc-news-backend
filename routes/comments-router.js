const express = require('express');
const commentsRouter = express.Router();

const { deleteComment } = require('../controller/commentsController');

commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;
