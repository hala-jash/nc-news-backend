const db = require('../db/connection');

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
exports.insertTopic = (req) => {
  const { description, slug } = req.body;
  return db
    .query(
      `INSERT INTO topics (description,slug) VALUES ($1, $2) RETURNING *`,
      [description, slug]
    )
    .then((topic) => {
      return topic.rows[0];
    });
};
