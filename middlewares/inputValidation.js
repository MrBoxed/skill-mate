const Joi = require('joi');

// Input validation for SignUp Form 
const signupValidation = (req, res, next) => {

    const signUpSchema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        username: Joi.string(),
        password: Joi.string().min(8).max(100).required(),
        dateOfBirth: Joi.date(),
        phoneNumber: Joi.number().min(10),
        education: Joi.object(),
        areaOfStudy: Joi.string(),
        userType: Joi.string(),
        termsAccepted: Joi.boolean()
    });

    const { error } = signUpSchema.validate(req.body);

    if (error) {
        return res.status(400)
            .json({
                message: "Bad request",
                error
            })
    }

    next();
}

// Input validation for Login Form 
const loginValidation = (req, res, next) => {

    const loginSchema = Joi.object({

        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(100).required(),

    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400)
            .json({
                message: "Bad request",
                error
            })
    }

    next();
}

const courseUploadValidation = (req, res, next) => {

    const courseUploadSchema = Joi.object({
        title: Joi.string().required()
    });

    const { error } = courseUploadSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: "Bad request",
        })
    }

    next();
}

module.exports = {
    signupValidation,
    loginValidation,
    courseUploadValidation
}