const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const JobSeeker = require("../models/JobSeekerModel");
const Admin = require("../models/AdminModel");
const Employer = require("../models/EmployerModel");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;


        const user = await User.findOne({
            Email: email
        });


        if (!user) {

            return res.json({
                success: false,
                error: "Invalid credentials"
            });

        }


        const isMatch = await bcrypt.compare(
            password,
            user.Password
        );


        if (!isMatch) {

            return res.json({
                success: false,
                error: "Invalid credentials"
            });

        }



        const token = jwt.sign(
            {
                id: user.UserId,
                role: user.Role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );




        let name = "";

        if (user.Role === "Admin") {
            const profile = await Admin.findById(user.UserId);
            name = profile ? profile.Name : "";
        } else if (user.Role === "Employer") {
            const profile = await Employer.findById(user.UserId);
            name = profile ? profile.Name : "";
        } else if (user.Role === "JobSeeker") {
            const profile = await JobSeeker.findById(user.UserId);
            name = profile ? profile.Name : "";
        }

        res.json({
            success: true,
            token,
            role: user.Role,
            userId: user.UserId,
            name: name,
        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: "Server Error"
        });

    }

};

exports.JobSeekerReg = async (req, res) => {
    try {
        const { name, email, contact, address, password, qual, skills, DOB, Bio, gender } = req.body;

        let skillsList = skills;
        if (typeof skills === "string") {
            skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
        }


        const existingUser = await User.findOne({ Email: email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Create Job Seeker
        const jobSeeker = await JobSeeker.create({
            Name: name,
            Email: email,
            Contact: contact,
            Address: address,
            DOB,
            Gender: gender,
            Qualification: qual,
            Skills: skillsList,
            Bio,

            Role: "JobSeeker",

            ProfilePic: req.file
                ? "profiles/" + req.file.filename
                : "default.png"
        });
        // Hash password
        const hashPass = await bcrypt.hash(password, 10);

        // Create login credentials
        await User.create({
            Email: email,
            Password: hashPass,
            UserId: jobSeeker._id,
            Role: "JobSeeker"
        });

        return res.status(201).json({
            success: true,
            message: "Job Seeker Registered Successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Registration Failed",
            error: error.message
        });
    }
};