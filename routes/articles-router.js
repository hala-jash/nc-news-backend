// articles.js
const express = require('express');
const articleRouter = express.Router();
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComments,
  patchArticle,
} = require('../controller/articlesController');

articleRouter.get('/', getArticles);
articleRouter.get('/:article_id', getArticleById);
articleRouter.get('/:article_id/comments', getArticleComments);
articleRouter.post('/:article_id/comments', postArticleComments);
articleRouter.patch('/:article_id', patchArticle);

module.exports = articleRouter;
