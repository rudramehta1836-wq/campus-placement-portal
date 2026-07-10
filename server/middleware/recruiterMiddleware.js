const recruiterOnly = (req, res, next) => {

    if (req.student.role !== "recruiter") {

        return res.status(403).json({
            success: false,
            message: "Only Recruiters Can Access This Route"
        });

    }

    next();

};

module.exports = recruiterOnly;