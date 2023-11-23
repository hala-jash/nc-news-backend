const db = require('../db/connection');

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
