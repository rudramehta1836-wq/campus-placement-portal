const Drive = require("../models/driveModel");

const createDrive = async (req, res) => {

    try {

        const {
            companyName,
            jobRole,
            package,
            location,
            eligibilityCGPA,
            lastDateToApply,
            description
        } = req.body;

        if (
            !companyName ||
            !jobRole ||
            !package ||
            !location ||
            eligibilityCGPA === undefined ||
            !lastDateToApply ||
            !description
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });

        }

        const drive = await Drive.create({

            companyName,
            jobRole,
            package,
            location,
            eligibilityCGPA,
            lastDateToApply,
            description,

            createdBy: req.student.id

        });

        return res.status(201).json({

            success: true,
            message: "Placement Drive Created Successfully",

            drive

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
const getAllDrives = async (req, res) => {

    try {

        const drives = await Drive.find()
            .populate("createdBy", "recruiterName companyName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: drives.length,
            drives
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getDriveById = async (req, res) => {

    try {

        const { id } = req.params;

        const drive = await Drive.findById(id)
            .populate("createdBy", "recruiterName companyName email");

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: "Drive not found"
            });
        }

        return res.status(200).json({
            success: true,
            drive
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const updateDrive = async (req, res) => {

    try {

        const { id } = req.params;

        const drive = await Drive.findById(id);

        if (!drive) {

            return res.status(404).json({
                success: false,
                message: "Drive not found"
            });

        }

        if (drive.createdBy.toString() !== req.student.id) {

            return res.status(403).json({
                success: false,
                message: "You can update only your own drives"
            });

        }

        const updatedDrive = await Drive.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Drive Updated Successfully",
            drive: updatedDrive
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const applyToDrive = async (req, res) => {

    try {

        const { id } = req.params;

        const drive = await Drive.findById(id);

        if (!drive) {

            return res.status(404).json({
                success: false,
                message: "Drive not found"
            });

        }

        if (drive.applicants.includes(req.student.id)) {

            return res.status(400).json({
                success: false,
                message: "You have already applied"
            });

        }

        drive.applicants.push(req.student.id);

        await drive.save();

        return res.status(200).json({

            success: true,
            message: "Applied Successfully"

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    applyToDrive
};