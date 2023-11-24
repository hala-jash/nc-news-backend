const db = require('../db/connection');

exports.selectUsers = (req) => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
exports.selectUserByUserName = (username) => {
  //  true  3    3   "3"
  if (!isNaN(+username)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `SELECT * FROM users
      WHERE users.username = $1;`,
      [username]
    )
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      return result.rows[0];
    })
};
