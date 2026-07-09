const express = require("express");

const router = express.Router();

const {
    registerRecruiter,
    loginRecruiter
} = require("../controllers/recruiterController");

router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);

module.exports = router;