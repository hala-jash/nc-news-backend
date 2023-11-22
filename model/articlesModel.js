const db = require('../db/connection');
exports.selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by = 'created_at', order = 'DESC') => {
  let queryString = `SELECT articles.*,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY
    articles.article_id `;
  const validSortBy = ['title', 'author', 'topic', 'votes', 'created_at'];
  const validOrder = ['ASC', 'DESC'];
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
