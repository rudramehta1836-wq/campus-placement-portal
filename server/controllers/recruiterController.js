const Recruiter = require("../models/recruiterModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerRecruiter = async (req, res) => {
    try {

        const {
            companyName,
            recruiterName,
            email,
            password
        } = req.body;

        if (
            !companyName ||
            !recruiterName ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingRecruiter = await Recruiter.findOne({ email });

        if (existingRecruiter) {
            return res.status(400).json({
                success: false,
                message: "Recruiter already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const recruiter = await Recruiter.create({
            companyName,
            recruiterName,
            email,
            password: hashedPassword
        });

        const recruiterObject = recruiter.toObject();

        delete recruiterObject.password;
        delete recruiterObject.__v;

        return res.status(201).json({
            success: true,
            message: "Recruiter Registered Successfully",
            recruiter: recruiterObject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const loginRecruiter = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const recruiter = await Recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found"
            });
        }

        const isMatch = await bcrypt.compare(password, recruiter.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: recruiter._id,
                role: "recruiter"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const recruiterObject = recruiter.toObject();

        delete recruiterObject.password;
        delete recruiterObject.__v;

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            recruiter: recruiterObject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getRecruiterDashboard = async (req, res) => {
    try {

        const drives = await Drive.find({
            createdBy: req.student.id
        });

        const totalDrives = drives.length;

        const today = new Date();

        const activeDrives = drives.filter(
            drive => drive.lastDateToApply > today
        ).length;

        let totalApplicants = 0;
        let selectedStudents = 0;

        drives.forEach(drive => {

            totalApplicants += drive.applicants.length;

            drive.applicants.forEach(applicant => {

                if (applicant.status === "Selected") {
                    selectedStudents++;
                }

            });

        });

        return res.status(200).json({
            success: true,
            totalDrives,
            activeDrives,
            totalApplicants,
            selectedStudents
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    registerRecruiter,
    loginRecruiter,
    getRecruiterDashboard
};