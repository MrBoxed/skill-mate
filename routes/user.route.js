const express = require('express');
const { signupController, loginController } = require('../controllers/user.controller.js');
const { signupValidation, loginValidation } = require('../middlewares/inputValidation.js');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.render('login');
});

userRouter.post('/signup', signupValidation, signupController)
userRouter.post('/login', loginValidation, loginController);

module.exports = userRouter;
