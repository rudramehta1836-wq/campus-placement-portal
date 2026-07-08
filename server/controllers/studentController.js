const Student = require("../models/studentModel");

const registerStudent = async (req, res) => {

    try {

        // Extract data from request body
        const {
            name,
            rollNumber,
            email,
            password,
            branch,
            cgpa
        } = req.body;

        // Validate required fields
        if (
            !name ||
            !rollNumber ||
            !email ||
            !password ||
            !branch ||
            cgpa === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check if email already exists
        const existingEmail = await Student.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Check if roll number already exists
        const existingRollNumber = await Student.findOne({ rollNumber });

        if (existingRollNumber) {
            return res.status(400).json({
                success: false,
                message: "Roll Number already registered"
            });
        }

        // Create student
        const student = await Student.create({
            name,
            rollNumber,
            email,
            password,
            branch,
            cgpa
        });

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    registerStudent
};