const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    education: {
        level: {
            type: String,
            required: false,
            enum: ['High School', 'Undergraduate', 'Postgraduate', 'Other']
        },
        institutionName: {
            type: String,
            required: false,
            trim: true
        }
    },
    areaOfStudy: {
        type: String,
        required: false,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Student', 'Instructor'],
        default: 'Student'
    },
    termsAccepted: {
        type: Boolean,
        required: true,
        default: false
    }
},
    { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
