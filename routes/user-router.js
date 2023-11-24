const userRouter = require('express').Router();
const { getUsers, getUserByUserName } = require('../controller/usersController');

userRouter.get('/', getUsers);
userRouter.get('/:username', getUserByUserName);

module.exports = userRouter;
