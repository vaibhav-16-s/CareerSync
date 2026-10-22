const Admin = require("../models/AdminModel");
const Employer = require("../models/EmployerModel");
const JobSeeker = require("../models/JobSeekerModel");
const User = require("../models/UserModel");

// Get logged-in user's profile
exports.getMyProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        let profile = null;

        if (role === "Admin") {
            profile = await Admin.findById(id);
        } else if (role === "Employer") {
            profile = await Employer.findById(id);
        } else if (role === "JobSeeker") {
            profile = await JobSeeker.findById(id);
        }

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.json({
            success: true,
            role: role,
            profile: profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update logged-in user's profile (with optional profile picture)
exports.updateMyProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        const body = req.body;

        let profilePic = null;
        if (req.file) {
            profilePic = "profiles/" + req.file.filename;
        }

        if (role === "Admin") {
            const updateData = {
                Name: body.name,
                Email: body.email,
                Contact: body.contact,
                Address: body.address,
            };
            if (profilePic) updateData.ProfilePic = profilePic;

            const profile = await Admin.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            await User.findOneAndUpdate({ UserId: id }, { Email: body.email });

            return res.json({
                success: true,
                message: "Profile updated successfully",
                profile: profile,
            });
        }

        if (role === "Employer") {
            const updateData = {
                Name: body.name,
                Email: body.email,
                Contact: body.contact,
                Address: body.address,
                Website: body.web,
            };
            if (profilePic) updateData.ProfilePic = profilePic;

            const profile = await Employer.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            await User.findOneAndUpdate({ UserId: id }, { Email: body.email });

            return res.json({
                success: true,
                message: "Profile updated successfully",
                profile: profile,
            });
        }

        if (role === "JobSeeker") {
            let skillsList = body.skills;
            if (typeof skillsList === "string") {
                skillsList = skillsList
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }

            const updateData = {
                Name: body.name,
                Email: body.email,
                Contact: body.contact,
                Address: body.address,
                DOB: body.DOB,
                Gender: body.gender,
                Qualification: body.qual,
                Bio: body.Bio || "",
                Skills: skillsList,
            };
            if (profilePic) updateData.ProfilePic = profilePic;

            const profile = await JobSeeker.findByIdAndUpdate(id, updateData, {
                new: true,
            });

            await User.findOneAndUpdate({ UserId: id }, { Email: body.email });

            return res.json({
                success: true,
                message: "Profile updated successfully",
                profile: profile,
            });
        }

        res.status(400).json({
            success: false,
            message: "Invalid role",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
