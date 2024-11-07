const fs = require('fs')
const { CourseDetail, BasicCourse } = require("../models/course.model");
const { getVideoDurationInSeconds } = require('get-video-duration')

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

async function GetCourseById(req, res) {

    try {

        let result = await BasicCourse.findById(req.params.videoId);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }

        else {

            res.status(200).json({
                status: "success",
                message: result
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

async function UpdateCourseByPatch(req, res) {
    try {

        const result = await CourseDetail.findByIdAndUpdate(req.params.id, req.body);

        if (!result) {
            return res.status(400).json({ error: 'Didnot found the item' });
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


module.exports = {
    UploadCourse,
    GetAllCourses,
    GetCourseById,
    UpdateCourseByPatch,
    StreamVideo
}