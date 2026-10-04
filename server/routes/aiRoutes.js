const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const studentOnly = require("../middleware/studentMiddleware");
const { matchResume } = require("../controllers/aiController");
const multer = require("multer");

const uploadMemory = multer({ storage: multer.memoryStorage() });

router.post("/match", protect, studentOnly, uploadMemory.single("resumeFile"), matchResume);

module.exports = router;
