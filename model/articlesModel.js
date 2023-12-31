const db = require('../db/connection');
exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      return result.rows[0];
    });
};
exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  let queryString = `SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const validSortBy = ['title', 'author', 'topic', 'votes', 'created_at'];
  const validOrder = ['ASC', 'DESC'];
  if (topic) {
    queryString += `WHERE articles.topic = '${topic}' `;
  }

  queryString += `GROUP BY articles.article_id `;

  if (
    sort_by &&
    order &&
    validSortBy.includes(sort_by) &&
    validOrder.includes(order)
  ) {
    queryString += `ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleComment = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE comments.article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (req) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateArticle = (req) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE Article_id =$2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertArticle = (req) => {
  const { author, title, body, topic, article_img_url } = req.body;
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body ,article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, topic, author, body, article_img_url]
    )
    .then((article) => {
      return article.rows[0];
    });
};

exports.deleteArticleModel = (req) => {
  const { article_id } = req.params;
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
    article_id
  ]);
};
