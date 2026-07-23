const express = require("express");

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