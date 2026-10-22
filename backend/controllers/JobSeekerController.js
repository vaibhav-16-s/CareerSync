const Job = require("../models/JobModel");


// Search Jobs
exports.searchJobs = async (req, res) => {

    try {

        const filter = {
            Status: "Active"
        };


        // Search by job title
        if (req.query.title) {

            filter.Title = {
                $regex: req.query.title,
                $options: "i"
            };

        }


        // Search by location
        if (req.query.location) {

            filter.Location = {
                $regex: req.query.location,
                $options: "i"
            };

        }


        // Filter by job type
        if (req.query.jobType) {

            filter.JobType = req.query.jobType;

        }



        const jobs = await Job
            .find(filter)
            .populate("CompanyId", "Name");



        res.status(200).json(jobs);


    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};