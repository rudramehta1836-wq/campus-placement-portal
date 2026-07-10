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

module.exports = {
    createDrive
};