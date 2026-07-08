const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
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

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    branch: {
        type: String,
        required: true
    },

    cgpa: {
        type: Number,
        required: true
    },

    skills: [{
        type: String
    }],

    phone: {
        type: String
    },

    resume: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: "student"
    }

}, {
    timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;