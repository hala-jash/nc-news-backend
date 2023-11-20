const db = require('../db/connection');

exports.selectTopics = (req) => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
