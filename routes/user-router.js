const userRouter = require('express').Router();
const { getUsers } = require('../controller/usersController');

userRouter.get('/', getUsers);

module.exports = userRouter;
