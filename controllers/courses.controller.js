const { CourseDetail } = require("../models/course.model");

async function AddCourse(req, res) {

    try {
        let course = new CourseDetail(req.body);

        if (!course) {
            res.status(400).json({ status: 'failure', message: 'Input error' });
        }

        else {
            let result = await course.save();

            res.status(200).json({
                status: 'success',
                message: course,
                result: result
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'failure',
            message: 'Internal Server Error'
        });
    }
}

async function GetAllCourses(req, res) {

    try {

        let allCourse = await CourseDetail.find();

        if (!allCourse) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(200).json({
            status: "success",
            message: allCourse
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failure",
            message: "Internal Server Error"
        });
    }
}

async function GetCourseById(req, res) {

    try {
        let result = await CourseDetail.findById(req.params.id);

        if (!result) {
            return res.status(500).json({ error: 'Internal Server Error' });
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


module.exports = {
    AddCourse,
    GetAllCourses,
    GetCourseById
}