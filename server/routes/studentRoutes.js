const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const { registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile } = require("../controllers/studentController");
router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", protect, getStudentProfile);
router.put("/profile", protect, updateStudentProfile);
module.exports = router;