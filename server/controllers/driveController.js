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

        const alreadyApplied = drive.applicants.find(
            applicant => applicant.student.toString() === req.student.id
        );

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this drive"
            });
        }

        drive.applicants.push({
            student: req.student.id
        });

        await drive.save();

        return res.status(200).json({
            success: true,
            message: "Applied Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const deleteDrive = async (req, res) => {

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
                message: "You can delete only your own drives"
            });

        }

        await Drive.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Drive deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getDriveApplicants = async (req, res) => {
    try {

        const { id } = req.params;

        const drive = await Drive.findById(id).populate({
            path: "applicants.student",
            select: "name email rollNumber branch cgpa resume"
        });

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: "Drive not found"
            });
        }

        if (drive.createdBy.toString() !== req.student.id) {
            return res.status(403).json({
                success: false,
                message: "You can only view applicants for your own drives"
            });
        }

        return res.status(200).json({
            success: true,
            applicants: drive.applicants
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const updateApplicationStatus = async (req, res) => {
    try {

        const { driveId, studentId } = req.params;
        const { status } = req.body;

        const drive = await Drive.findById(driveId);

        if (!drive) {
            return res.status(404).json({
                success: false,
                message: "Drive not found"
            });
        }

        if (drive.createdBy.toString() !== req.student.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this drive"
            });
        }

        const applicant = drive.applicants.find(
            applicant => applicant.student.toString() === studentId
        );

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant not found"
            });
        }

        applicant.status = status;

        await drive.save();

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            applicant
        });

    } catch (error) {

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
    applyToDrive,
    deleteDrive,
    getDriveApplicants,
    updateApplicationStatus
};