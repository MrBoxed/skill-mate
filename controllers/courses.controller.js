const fs = require('fs')
const { getVideoDurationInSeconds } = require('get-video-duration');
const { CourseDetail, BasicCourse } = require("../models/course.model");
const { Enrollment } = require('../models/enrollement.model');
const { default: mongoose } = require('mongoose');
const { Review } = require('../models/review.model');
const User = require('../models/user.model');

// function for getting all list of the course
async function GetAllCourses(req, res) {

    try {

        let allCourse = await BasicCourse.find();

        if (!allCourse) {
            return res.status(500).json({
                success: false,
                error: 'Internal Server Error'
            });
        }

        res.status(200)
            .json({
                status: "success",
                message: allCourse
            })
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            });
    }
}

// function for getting a single course from database 
async function GetCourseById(req, res) {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
            return res.status(400).json({
                success: false,
                messsage: "bad course id"
            });
        }

        const result = await BasicCourse.findById(req.params.courseId);

        const reviewMsg = await GetAllReviewOfCourse(req.params.courseId);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Could not found the course"
            });
        }

        else {

            res.status(200).json({
                status: "success",
                message: result,
                reviews: reviewMsg
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failure",
            message: "Internal Server Error"
        });
    }
}

// function to update course details 
async function UpdateCourseByPatch(req, res) {

    try {

        const result = await BasicCourse.findByIdAndUpdate(req.params.id, req.body);

        if (!result) {
            return res.status(400).json({ error: 'Did not found the item' });
        }
        else {

            res.status(200).json({
                status: "success",
                message: result,
                id: req.param
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failure",
            message: "Internal Server Error"
        });
    }
}

// will fetch the video from filsystem and will stream 
async function StreamVideo(req, res) {

    const range = req.headers.range;

    if (!range) {
        res.status(400).json({
            success: false,
            message: "range header not found",
        });
        console.log('Access without range-header: Denied');
        return;
    }

    const courseDetails = await BasicCourse.findById(req.params.videoId);

    if (!courseDetails) {
        return res.status(404).json({
            success: false,
            message: "This resource does not exists"
        });
    }

    // try {
    //     // fetch the video fromt the course link 
    //     // send the segment of that video
    //     // in writebuffer

    //     const video = await Video.findById(req.params.videoId);

    //     if (!video) {
    //         return res.status(404).send('Video not found');
    //     }

    //     // Increment the view count
    //     video.views += 1;
    //     await video.save();

    //     res.send(`You are watching: ${video.title}`);
    // } catch (error) {
    //     res.status(500).send('Error watching video');
    // }

    const videoPath = courseDetails.videoUrl;

    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 10 ** 6
    // bytes = 64165

    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}

// function to upload the course
async function UploadCourse(req, res) {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file provided. Video file required '
        }
        );
    }

    try {

        // finding video duration 
        const videoDuration = await getVideoDurationInSeconds(req.file.path);        // find the duration of the video
        const thumbnailPath = req.thumbnailUrl;
        console.log("Thumbnail path: " + thumbnailPath);

        var course = new BasicCourse({
            title: req.body.title,
            description: req.body.description,
            instructor: req.body.instructor,
            category: req.body.category,
            level: req.body.level,
            prerequisites: req.body.prerequisites,
            customCategory: req.body.customCategory,
            tags: req.body.tags,
            rating: req.body.rating,
            price: req.body.price,

            enrolledNumber: 0,
            videoUrl: req.file.path,
            duration: videoDuration,
            thumbnailUrl: thumbnailPath,

        });

        if (!course) {
            res.status(400).json({
                status: 'failure',
                message: 'Input error'
            });
        }

        else {

            let result = await course.save();

            res.status(201).json({
                success: true,
                message: "Course Uploaded Successfully"
            });
        }
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Internal Server Error '
        });
    }
}

// FOR COURSE HOME PAGE:
// #####################################
// Finding the courses from the database with respect to the provided array category
// ###################################
const getCoursesByCategoryCaseInsensitive = async (categoryName) => {
    // Fetch courses based on the category (case-insensitive) and limit to 5
    const courses = await BasicCourse.find({
        category: { $regex: new RegExp(`^${categoryName}$`, 'i') }
    }).limit(5);
    return courses;
};

// #####################################
// Function to build the tabs structure
// ##################################
const buildTabsWithCourses = async (categories) => {
    const tabs = [];

    for (let categoryName of categories) {
        const courses = await getCoursesByCategoryCaseInsensitive(categoryName);
        tabs.push({
            category: categoryName,
            courses: courses
        });
    }

    return tabs;
};

//  providing the tabs with course details
const HomeTabDetails = async (req, res) => {

    const categories = ['Technology', 'Business', 'Art', 'Health']

    try {

        const tabsData = await buildTabsWithCourses(categories);

        if (!tabsData) {
            return res.status(400).json({
                success: false,
                error: 'Courses tabs data: null'
            });
        }

        else {

            res.status(200).json({
                success: true,
                message: tabsData,
            });
        }

    } catch (e) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Internal Server Error '
        });
    }

}

// Fetching random coures
// TODO FIND TOP OR RANDOM
const FeaturedCourses = async (req, res) => {

    try {

        const randomCourses = await BasicCourse.aggregate([
            { $sample: { size: 6 } } // Randomly select 6 courses
        ]);

        if (!randomCourses) {
            return res.status(400).json({
                success: false,
                error: 'No Data present'
            });
        }

        else {
            res.status(200).json({
                success: true,
                message: randomCourses,
            });
        }

    } catch (e) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Internal Server Error '
        });
    }
}

// COURSE SEARCH API
const SearchCourse = async (req, res) => {

    const { query, category, limit = 10 } = req.query;

    try {
        // Build the search conditions dynamically
        let searchConditions = {};

        if (query) {
            searchConditions = {
                $or: [
                    { title: { $regex: query, $options: 'i' } }, // Case-insensitive search on title
                    { description: { $regex: query, $options: 'i' } }, // Case-insensitive search on description
                ]
            };
        }

        if (category) {
            searchConditions.category = { $regex: category, $options: 'i' }; // Case-insensitive search on category
        }

        // Perform the search query
        const courses = await BasicCourse.find(searchConditions)
            .limit(parseInt(limit)) // Limit the number of results
            .exec();

        // Send the result
        res.status(200).json({
            success: true,
            message: courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching courses' });
    }
}

// FOR ENROLLING THE USER
// TODO 
const EnrollStudent = async (req, res) => {

    const { userId } = req.user;
    const courseId = req.params.courseId;
    const todayDate = new Date().getDate();

    try {

        if (req.user === undefined) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID !"
            });
        }

        // Finding the course if exists 
        const course = await BasicCourse.findById(courseId);
        course.enrolledNumber += 1;

        await course.save();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "course not found!"
            });
        }

        const courseEnrollment = new Enrollment({
            student: userId,
            course: courseId,
            enrolledAt: todayDate,
            completed: false
        })

        // return res.status(201).json({
        //     success: true,
        //     data: courseEnrollment
        // })

        const result = await courseEnrollment.save();

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }

        else {

            res.status(201).json({
                success: true,
                message: 'User enrolled successfully'
            });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error at enrolling user', error: err });
    }

}


// COURSE REVIEWS
const CourseReview = async (req, res) => {

    const { userId } = req.user;
    const courseId = req.body.courseId;
    const rating = req.body.rating;
    const courseReviewMsg = req.body.comment;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID !"
            });
        }

        const course = await BasicCourse.findById(courseId);
        const userdata = await User.findById(userId);

        if (!course || !userdata) {
            return res.status(404).json({
                success: false,
                message: "Data not found!"
            });
        }

        const review = new Review({
            course: courseId,
            student: userId,
            rating: rating,
            comment: courseReviewMsg,
        });

        const savedData = await review.save();

        res.status(201).json({
            success: true,
            data: savedData
        });

    } catch (error) {
        console.log(error);
        res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            });
    }
}

// returning all reviews for the particular courseId
async function GetAllReviewOfCourse(courseId) {

    const reviewMsg = await Review.find({ course: new mongoose.Types.ObjectId(courseId) }).select('comment');

    return reviewMsg;
}

module.exports = {
    UploadCourse,
    GetAllCourses,
    GetCourseById,
    UpdateCourseByPatch,
    StreamVideo,
    HomeTabDetails,
    FeaturedCourses,
    SearchCourse,
    EnrollStudent,
    CourseReview
}