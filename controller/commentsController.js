const { deleteCommentModel, updateComment } = require('../model/commentsModel');

exports.deleteComment = (req, res, next) => {
  deleteCommentModel(req)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  updateComment(req)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
