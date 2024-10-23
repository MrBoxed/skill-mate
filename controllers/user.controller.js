const User = require('../models/userSignUp.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SECRET_TOKEN;

const signupController = async (req, res) => {

    // extracting the info form request body 
    const newUser = req.body;
    console.log(req.body);

    //if any 1 of the param is not found then send the bad request status :)
    if (!newUser.fullName || !newUser.email || !newUser.username || !newUser.dateOfBirth || !newUser.phoneNumber) {
        return (res.status(400)
            .json({ status: "error", message: "Did not recieved all params", request: req.body })
        );
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    console.log(hashedPassword);

    // if everything is correct then 
    const userInfo = new User({
        fullName: newUser.fullName,
        email: newUser.email,
        dateOfBirth: newUser.dateOfBirth,
        phoneNumber: newUser.phoneNumber,
        username: newUser.username,
        password: hashedPassword
    });

    const result = await userInfo.save();

    res.status(200).json({ status: "success", message: result })
    //res.status(200).json({ status: "succes", message: userInfo })
}

const loginController = async (req, res) => {

    try {

        // Check if the email exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }


    //check the correct email
    res.status(200);
    // res.json(`user #${req.body.email} AND pass:${password} & hash:${hashedPassword}`);
    res.redirect('/');

}

module.exports = {
    signupController,
    loginController
}
