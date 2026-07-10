const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const recruiterOnly = require("../middleware/recruiterMiddleware");

const {
    createDrive
} = require("../controllers/driveController");

router.post(
    "/",
    protect,
    recruiterOnly,
    createDrive
);

module.exports = router;