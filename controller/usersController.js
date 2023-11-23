const { selectUsers } = require("../model/usersModel");


exports.getUsers = (req, res, next) => {
    selectUsers(req).then((users) => {
        res.status(200).send({ users });
      })
      .catch(next);
  };