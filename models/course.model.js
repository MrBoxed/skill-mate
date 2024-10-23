const mongoose = require('mongoose');

const courseDetailSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    instructor: {
        type: String,
        required: true
    },

    duration: {
        type: Number,  // duration in hours
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    category: {
        type: String,
        enum: [
            'Technology',
            'Business',
            'Art',
            'Science',
            'Health',
            'Mathematics',
            'Social Sciences',
            'Engineering',
            'Education',
            'Personal Development',
            'Languages',
            'Music',
            'Data Science',
            'Marketing',
            'Psychology',
            'Culinary Arts',
            'Fitness',
            'Web Development',
            'Mobile Development',
            'Cloud Computing',
            'Cybersecurity',
            'AI & Machine Learning',
            'Creative Writing',
            'Photography',
            'Graphic Design',
            'Game Development',
            'Blockchain',
            'Finance',
            'Project Management'
        ],
        required: true
    },

    videoUrl: {
        type: String, // URL to the video
        required: true
    },
    thumbnailUrl: {
        type: String, // URL to the thumbnail image
        required: true
    },

    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },

    prerequisites: {
        type: [String], // Array of strings to list prerequisites
    },

    enrolledNumber: {
        type: Number, // No. of student or people enrolled in course
    },

    customCategory: {
        type: String, // Optional custom category
    },
    tags: {
        type: [String], // Array of tags for flexible categorization
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    }

}, { timestamps: true });



module.exports = {
    CourseDetail: mongoose.model('CourseDetail', courseDetailSchema)
}