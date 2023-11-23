const { deleteCommentModel } = require('../model/commentsModel');

exports.deleteComment = (req, res, next) => {
  deleteCommentModel(req)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
