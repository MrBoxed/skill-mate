const express = require('express');
const { CourseDetail } = require('../models/course.model');
const courseRouter = express.Router();

const { GetAllCourses, AddCourse, GetCourseById } = require('../controllers/courses.controller.js');

// Course route
courseRouter.get('/', (req, res) => {
    //Return users opted courses
    res.send("<h1> this is course page showing all coursed </h1>")
});

courseRouter.get('/all', GetAllCourses);

courseRouter.post('/new', AddCourse)

courseRouter.get('/id/:id', GetCourseById);




module.exports = courseRouter;