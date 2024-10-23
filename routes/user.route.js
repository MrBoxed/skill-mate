const express = require('express');
const { signupController, loginController } = require('../controllers/user.controller.js');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.render('login');
});

userRouter.post('/signup', signupController)

userRouter.post('/login', loginController);

module.exports = userRouter;
