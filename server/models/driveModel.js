const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema({

    companyName: {
        type: String,
        required: true
    },

    jobRole: {
        type: String,
        required: true
    },

    package: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    eligibilityCGPA: {
        type: Number,
        required: true
    },

    lastDateToApply: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true
    },
    applicants: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }
]

},
    {
        timestamps: true
    });

module.exports = mongoose.model("Drive", driveSchema);