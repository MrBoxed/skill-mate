const fs = require('fs');
const express = require('express');
const courseRouter = express.Router();
const multerUpload = require('../middlewares/fileUpload.middleware.js');

const { CourseDetail, BasicCourse } = require('../models/course.model');

const { GetAllCourses, AddCourse, GetCourseById, UpdateCourseByPatch, StreamVideo, UploadCourse, HomeTabDetails, FeaturedCourses, SearchCourse, EnrollStudent } = require('../controllers/courses.controller.js');


// ############################################################ //
//                  :: BASIC FRONTEND FOR TESTING ::
//  TO BE REMOVED   :: ONLY FOR TESTING PURPOSE
// ########################################################### //

// course main route
courseRouter.get('/', (req, res) => {
    //Return users opted courses
    res.send("<h1> this is course page showing all coursed </h1>")
});

// video Player page
courseRouter.get('/watch', function (req, res) {
    res.render('videoPlayer');
})

// videoUpload page
courseRouter.get('/upload', (req, res) => {
    res.render('upload')
});


// ####################################################### //



// CREATING COURSE:
//      will upload course to the server
courseRouter.post(
    '/upload',
    multerUpload.Upload.single('videoFile'),
    multerUpload.CreateThumbnail,
    UploadCourse
);

// COURSE FOR HOMEPAGE:
// providing array of category with course data
courseRouter.get('/tabs', HomeTabDetails);

// providing small array of courese
courseRouter.get('/featured', FeaturedCourses)

// get all the courses
courseRouter.get('/all', GetAllCourses);

// get a particular course
courseRouter.get('/info/:videoId', GetCourseById);

// DELETE COURSE
// deleting a course 
courseRouter.delete('/remove/:id', (req, res) => {
    // To do find the course by id and delete
});

// UPDATING COURSE DETAILS
// updating a course info 
courseRouter.patch('/:id', UpdateCourseByPatch)

// STREAMING VIDEO
// for watching the video of the course
courseRouter.get('/watch/:videoId', StreamVideo);

// SEARCH FEATURE
courseRouter.get('/search', SearchCourse)

// ENROLLMENT // FOR LATER 
courseRouter.post('/enrollment', EnrollStudent)

module.exports = courseRouter;