const express = require('express');
const homeRouter = express.Router();

// importing the routes
const userRouter = require('./user.route.js');
const courseRouter = require('./course.route.js')

// Root route
homeRouter.get('/', (req, res) => {
    // send top choices tabs 
    // in 1 tab send different sub tabs
    // in subtab send top choices courses
    // send course details

    // LEARNERS ARE VIEWING SECTION
    // Send 5 random videos 

    res.send("<h1> HOME </h1>")
});

// User route
homeRouter.use('/user', userRouter);


// Course route
homeRouter.use('/course', courseRouter);



module.exports = homeRouter;