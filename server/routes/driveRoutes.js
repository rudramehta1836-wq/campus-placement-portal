const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const recruiterOnly = require("../middleware/recruiterMiddleware");
const studentOnly = require("../middleware/studentMiddleware");

const {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
    applyToDrive,
    getDriveApplicants,
    updateApplicationStatus
} = require("../controllers/driveController");

router.post(
    "/",
    protect,
    recruiterOnly,
    createDrive
);
router.get("/", getAllDrives);
router.get("/:id", getDriveById);
router.put("/:id", protect, recruiterOnly, updateDrive);
router.delete("/:id", protect, deleteDrive);
router.post(
    "/:id/apply",
    protect,
    studentOnly,
    applyToDrive
);
router.put(
    "/:driveId/applicants/:studentId/status",
    protect,
    recruiterOnly,
    updateApplicationStatus
);
router.get("/:id/applicants", protect, recruiterOnly, getDriveApplicants);
module.exports = router;