const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const recruiterOnly = require("../middleware/recruiterMiddleware");

const {
    createDrive,
    getAllDrives,
    getDriveById,
    updateDrive
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

module.exports = router;