const { selectTopics, insertTopic } = require('../model/topicModel');

exports.getTopics = (req, res, next) => {
  selectTopics(req)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postTopic = (req, res, next) => {
  insertTopic(req)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
