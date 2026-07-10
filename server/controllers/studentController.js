const Student = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginStudent = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                role: "student"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const studentObject = student.toObject();

        delete studentObject.password;
        delete studentObject.__v;

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            student: studentObject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

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
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await Student.create({
            name,
            rollNumber,
            email,
            password: hashedPassword,
            branch,
            cgpa
        });

        // Convert Mongoose document to a normal JavaScript object
        const studentObject = student.toObject();

        // Remove password and __v from the response
        const { password: hashedPasswordResponse, __v, ...studentData } = studentObject;

        // Send success response
        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student: studentData
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getStudentProfile = async (req, res) => {
    try {

        const student = await Student.findById(req.student.id).select("-password -__v");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            student
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateStudentProfile = async (req, res) => {

    try {

        const { name, branch, cgpa } = req.body;

        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        student.name = name || student.name;
        student.branch = branch || student.branch;
        student.cgpa = cgpa ?? student.cgpa;

        const updatedStudent = await student.save();

        const studentObject = updatedStudent.toObject();

        delete studentObject.password;
        delete studentObject.__v;

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            student: studentObject
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile
};