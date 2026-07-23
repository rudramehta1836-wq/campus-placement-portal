const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const studentOnly = require("../middleware/studentMiddleware");

const router = express.Router();
const { registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile,
    uploadResume,
    getStudentDashboard } = require("../controllers/studentController");
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", protect, getStudentProfile);
router.put("/profile", protect, updateStudentProfile);
router.put(
    "/upload-resume",
    protect,
    studentOnly,
    upload.single("resume"),
    uploadResume
);
router.get(
    "/dashboard",
    protect,
    studentOnly,
    getStudentDashboard
);
module.exports = router;