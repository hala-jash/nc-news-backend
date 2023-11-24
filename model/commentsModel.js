const db = require('../db/connection');
exports.deleteCommentModel = (req) => {
  const { comment_id } = req.params
  if (isNaN(+comment_id)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
};

exports.updateComment = (req) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id =$2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};