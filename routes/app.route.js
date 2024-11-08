const express = require('express');
const homeRouter = express.Router();

// importing the routes
const userRouter = require('./user.route.js');
const courseRouter = require('./course.route.js')

// User route
homeRouter.use('/user', userRouter);

// Course route
homeRouter.use('/course', courseRouter);






//   :::::: TEST :::::::  //
//  TO BE REMOVED
homeRouter.get('/', (req, res) => {
    res.send("<h1> HOME </h1>")
});

module.exports = homeRouter;