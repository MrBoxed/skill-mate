const { default: mongoose } = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseDetail',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    Enrollment: mongoose.model("Enrollment", enrollmentSchema)
} 