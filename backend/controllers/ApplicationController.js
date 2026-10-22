const Application = require("../models/ApplicationModel");
const Job = require("../models/JobModel");


// Apply for a job (JobSeeker)

exports.applyJob = async (req, res) => {

    try {

        const { JobId } = req.body;


        // Check job exists

        const job = await Job.findById(JobId);


        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });

        }


        // Check duplicate application

        const existingApplication =
            await Application.findOne({

                JobId: JobId,

                JobSeekerId: req.user.id

            });


        if (existingApplication) {

            return res.status(400).json({

                message: "Already applied for this job"

            });

        }

        if(!req.file){

    return res.status(400).json({
        message:"Resume is required"
    });

}


       const application = await Application.create({

    JobId: JobId,

    JobSeekerId: req.user.id,

    EmployerId: job.CompanyId,

    Resume: req.file.filename,

    Status: "Pending"

});



        res.status(201).json({

            message: "Application submitted successfully",

            application

        });


    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};





// JobSeeker view his applications

exports.getMyApplications = async (req, res) => {

    try {


        const applications =
            await Application.find({

                JobSeekerId: req.user.id

            })
            .populate(
                "JobId",
                "Title Location Salary JobType"
            )
            .populate(
                "EmployerId",
                "Name"
            );



        res.json(applications);



    }
    catch (error) {


        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });


    }

};





// Employer view applications received

exports.getReceivedApplications = async (req, res) => {

    try {

        const applications = await Application.find({
            EmployerId: req.user.id
        })
        .populate(
            "JobId",
            "Title Location JobType Salary"
        )
        .populate(
            "JobSeekerId",
            "Name Email Contact"
        );


        res.json(applications);


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};




// Employer update application status

exports.updateApplicationStatus = async(req,res)=>{

    try{


        const {Status}=req.body;



        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (application.EmployerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Not allowed to update this application"
            });
        }

        application.Status = Status;
        await application.save();



        res.json({

            message:"Status updated",

            application

        });



    }
    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Server Error"

        });

    }

};