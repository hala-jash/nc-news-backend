const { selectUsers, selectUserByUserName } = require('../model/usersModel');

exports.getUsers = (req, res, next) => {
  selectUsers(req)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUserName = (req, res, next) => {
  const { username } = req.params;
  selectUserByUserName(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
