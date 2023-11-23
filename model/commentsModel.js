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
