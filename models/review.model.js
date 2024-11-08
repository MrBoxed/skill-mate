const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseDetail',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    Reviews: mongoose.model("Reviews", reviewSchema),
}