const express = require("express");
const protect = require("../middleware/authMiddleware");
const recruiterOnly = require("../middleware/recruiterMiddleware");

const router = express.Router();

const {
    registerRecruiter,
    loginRecruiter,
    getRecruiterDashboard
} = require("../controllers/recruiterController");

router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);
router.get(
    "/dashboard",
    protect,
    recruiterOnly,
    getRecruiterDashboard
);

module.exports = router;