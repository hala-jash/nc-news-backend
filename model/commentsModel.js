const db = require('../db/connection');
exports.deleteCommentModel = (req) => {
  const { comment_id } = req.params;
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
    comment_id,
  ]);
};
