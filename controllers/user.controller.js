const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_TOKEN;


// signUp controller 
const signupController = async (req, res) => {

    try {

        // extracting the info form request body 
        const newUser = req.body;

        // console.log(req.body);
        const user = await User.findOne({ email: newUser.email })

        // if user email already exists then tell them to login
        if (user) {
            return res.status(409)
                .json({
                    message: 'User is already exists, you can login',
                    success: false
                });
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        // if everything is correct then 
        const userInfo = new User({
            fullName: newUser.fullName,
            email: newUser.email,
            dateOfBirth: newUser.dateOfBirth,
            phoneNumber: newUser.phoneNumber,
            username: newUser.username,
            password: hashedPassword
        });

        // save the user model in db
        const result = await userInfo.save();

        // if everything good then send 201:Created
        res.status(201)
            .json({
                status: true,
                message: "Signup Successfully"
            });
    }
    catch (error) {
        res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            });
    }
}


// Login controller
const loginController = async (req, res) => {
    try {

        // Check if the email exists
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(403)
                .json({
                    success: false,
                    error: 'Invalid credentials'
                });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(403)
                .json({
                    success: false,
                    error: 'Invalid credentials'
                });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            {
                email: user.email,
                userId: user.id,
                name: user.fullName
            }
            , JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200)
            .json({
                success: true,
                message: "login successful",
                jwtToken,
                email: user.email,
                name: user.fullName
            });

    }

    catch (err) {
        res.status(500)
            .json({
                success: false,
                message: 'Internal server error',
                error: err,
            });
    }

}

module.exports = {
    signupController,
    loginController
}
