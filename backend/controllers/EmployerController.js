const Job = require("../models/JobModel");

// Register Job (uses logged-in employer from token)
exports.registerJob = async (req, res) => {
    try {
        const { title, desc, location, jobType, salary, status } = req.body;

        const job = await Job.create({
            Title: title,
            Desc: desc,
            Location: location,
            CompanyId: req.user.id,
            JobType: jobType,
            Salary: salary,
            Status: status || "Active",
        });

        res.status(201).json({
            success: true,
            message: "Job Posted Successfully",
            job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get jobs for the logged-in employer
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ CompanyId: req.user.id }).sort({
            createdAt: -1,
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update job status (Active / Inactive)
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, CompanyId: req.user.id },
            { Status: req.body.status },
            { new: true }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.json({
            success: true,
            message: "Job updated",
            job,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            CompanyId: req.user.id,
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
