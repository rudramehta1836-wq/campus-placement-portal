const studentOnly = (req, res, next) => {

    if (req.student.role !== "student") {

        return res.status(403).json({

            success: false,

            message: "Only Students Can Access This Route"

        });

    }

    next();

};

module.exports = studentOnly;