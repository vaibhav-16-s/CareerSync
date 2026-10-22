const Admin = require("../models/AdminModel");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const Employer = require("../models/EmployerModel");
const JobSeeker = require("../models/JobSeekerModel");
const Job =require("../models/JobModel");
const Application = require("../models/ApplicationModel");



//-------------------register---------------------------------

//admin
exports.AdminRegister = async (req, res) => {
    try {

        const existingUser = await User.findOne({ Email: req.body.email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const adminData = await Admin.create({
            Name: req.body.name,
            Email: req.body.email,
            Contact: req.body.contact,
            Address: req.body.address,
            Role: "Admin"
        });
        const hashpass = await bcrypt.hash(req.body.password, 10);

        await User.create({
            Email: req.body.email,
            Password: hashpass,
            UserId: adminData._id,
            Role: "Admin"
        })

        res.status(201).json({
            success: true,
            message: "User registered",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// ===========================
// Admin Dashboard Stats
// ===========================

exports.getDashboardStats = async(req,res)=>{

    try{

        console.log("Dashboard API called");


        const totalUsers = await User.countDocuments();

        console.log("Users:", totalUsers);


        const employers = await Employer.countDocuments();

        console.log("Employers:", employers);


        const jobSeekers = await JobSeeker.countDocuments();

        console.log("JobSeekers:", jobSeekers);


        const jobs = await Job.countDocuments({
            Status:"Active"
        });

        console.log("Jobs:", jobs);



        res.json({

            success:true,
            totalUsers,
            employers,
            jobSeekers,
            jobs

        });


    }
    catch(error){

        console.log("Dashboard Error:", error);


        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

//employer
exports.EmployerRegister = async (req, res) => {
    try {

        const existingUser = await User.findOne({ Email: req.body.email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const employerData = await Employer.create({
            Name: req.body.name,
            Email: req.body.email,
            Contact: req.body.contact,
            Address: req.body.address,
            Website: req.body.web,
            Role: "Employer"
        });


        const hashpass = await bcrypt.hash(req.body.password, 10);


        await User.create({
            Email: req.body.email,
            Password: hashpass,
            UserId: employerData._id,
            Role: "Employer"
        });


        res.status(201).json({
            success: true,
            message: "Employer registered successfully",
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

// ===========================
// Get All Employers
// ===========================

exports.getAllEmployers = async (req, res) => {

    try {

        const employers = await Employer.find().sort({ Name: 1 });

        const employersWithCounts = [];

        for (const emp of employers) {
            const jobCount = await Job.countDocuments({ CompanyId: emp._id });
            employersWithCounts.push({
                ...emp.toObject(),
                jobCount: jobCount
            });
        }

        res.json({
            success: true,
            count: employersWithCounts.length,
            employers: employersWithCounts
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};



// ===========================
// Get Employer By ID
// ===========================

exports.getEmployerById = async (req, res) => {

    try {

        const employer = await Employer.findById(req.params.id);

        if (!employer) {

            return res.status(404).json({
                success: false,
                message: "Employer not found"
            });
        }

        res.json({
            success: true,
            employer
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};



// ===========================
// Search Employer
// ===========================

exports.searchEmployer = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        const employers = await Employer.find({

            $or: [

                { Name: { $regex: keyword, $options: "i" } },
                { Address: { $regex: keyword, $options: "i" } },
                { Website: { $regex: keyword, $options: "i" } }

            ]

        });

        res.json({
            success: true,
            employers
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};



// ===========================
// Update Employer
// ===========================

exports.updateEmployer = async (req, res) => {

    try {

        const employer = await Employer.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!employer) {

            return res.status(404).json({

                success: false,
                message: "Employer not found"

            });

        }

        res.json({

            success: true,
            message: "Employer Updated Successfully",
            employer

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};



// ===========================
// Delete Employer
// ===========================

exports.deleteEmployer = async (req, res) => {

    try {

        const employer = await Employer.findById(req.params.id);

        if (!employer) {

            return res.status(404).json({
                success: false,
                message: "Employer not found"
            });

        }

        await employer.deleteOne();

        res.json({

            success: true,
            message: "Employer Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};



//==================   MAnage Job Seekers   ============================================

// ===========================
// Get All JobSeekers
// ===========================

exports.getAllJobSeekers = async (req, res) => {

    try {

        const jobseekers = await JobSeeker.find().sort({ Name: 1 });

        const jobseekersWithCounts = [];

        for (const js of jobseekers) {
            const applicationCount = await Application.countDocuments({
                JobSeekerId: js._id
            });
            jobseekersWithCounts.push({
                ...js.toObject(),
                applicationCount: applicationCount
            });
        }

        res.json({
            success: true,
            count: jobseekersWithCounts.length,
            jobseekers: jobseekersWithCounts
        });


    } catch (err) {

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

};


// ===========================
// Get JobSeeker By ID
// ===========================

exports.getJobSeekerById = async (req,res)=>{

    try{

        const jobseeker = await JobSeeker.findById(req.params.id);


        if(!jobseeker){

            return res.status(404).json({

                success:false,
                message:"JobSeeker not found"

            });

        }


        res.json({

            success:true,
            jobseeker

        });


    }
    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

};


// ===========================
// Search JobSeekers
// ===========================

exports.searchJobSeeker = async(req,res)=>{

    try{

        const keyword = req.query.keyword || "";


        const jobseekers = await JobSeeker.find({

            $or:[

                {
                    Name:{
                        $regex:keyword,
                        $options:"i"
                    }
                },

                {
                    Email:{
                        $regex:keyword,
                        $options:"i"
                    }
                },

                {
                    Address:{
                        $regex:keyword,
                        $options:"i"
                    }
                },

                {
                    Skills:{
                        $regex:keyword,
                        $options:"i"
                    }
                }

            ]

        });


        res.json({

            success:true,
            jobseekers

        });


    }
    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

};


// ===========================
// Delete JobSeeker
// ===========================

exports.deleteJobSeeker = async(req,res)=>{

    try{


        const jobseeker = await JobSeeker.findById(req.params.id);


        if(!jobseeker){

            return res.status(404).json({

                success:false,
                message:"JobSeeker not found"

            });

        }


        await jobseeker.deleteOne();


        res.json({

            success:true,
            message:"JobSeeker deleted successfully"

        });


    }
    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

};



// ===========================
// Update Employer Details
// ===========================

exports.updateEmployer = async (req, res) => {

    try {


        const employer = await Employer.findById(req.params.id);


        if(!employer){

            return res.status(404).json({

                success:false,
                message:"Employer not found"

            });

        }



        const updatedEmployer = await Employer.findByIdAndUpdate(

            req.params.id,

            {
                Name:req.body.name,
                Email:req.body.email,
                Website:req.body.web,
                Contact:req.body.contact,
                Address:req.body.address
            },

            {
                new:true,
                runValidators:true
            }

        );



        res.json({

            success:true,
            message:"Employer updated successfully",
            employer:updatedEmployer

        });



    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};


// ===========================
// Delete Employer
// ===========================

exports.deleteEmployer = async (req, res) => {

    try {


        const employer = await Employer.findById(req.params.id);


        if (!employer) {

            return res.status(404).json({

                success: false,
                message: "Employer not found"

            });

        }



        await employer.deleteOne();



        // Also remove login credentials
        await User.findOneAndDelete({
            UserId: req.params.id
        });



        res.json({

            success: true,
            message: "Employer deleted successfully"

        });



    }
    catch(error) {


        res.status(500).json({

            success:false,
            message:error.message

        });


    }

};


// ===========================
// Delete JobSeeker
// ===========================

exports.deleteJobSeeker = async (req, res) => {

    try {


        const jobseeker = await JobSeeker.findById(req.params.id);


        if(!jobseeker){

            return res.status(404).json({

                success:false,
                message:"JobSeeker not found"

            });

        }



        // delete JobSeeker profile

        await jobseeker.deleteOne();



        // delete login credentials

        await User.findOneAndDelete({

            UserId:req.params.id

        });



        res.json({

            success:true,
            message:"JobSeeker deleted successfully"

        });



    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};


// =================================
// Update User Password
// Works for Admin, Employer, JobSeeker
// =================================


exports.updatePassword = async(req,res)=>{


    try{


        const {id}=req.params;

        const {password}=req.body;



        if(!password){

            return res.status(400).json({

                success:false,
                message:"Password is required"

            });

        }



        // find user using UserId

        const user = await User.findOne({

            UserId:id

        });



        if(!user){


            return res.status(404).json({

                success:false,
                message:"User account not found"

            });


        }




        // hash new password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );



        user.Password = hashedPassword;


        await user.save();



        res.json({

            success:true,
            message:"Password updated successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });


    }


};
