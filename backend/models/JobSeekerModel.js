const mongoose = require("mongoose");

const JobSeekerSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true
        },

        Email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        Contact: {
            type: String,
            required: true
        },

        Address: {
            type: String,
            required: true
        },

        DOB: {
            type: Date,
            required: true
        },

        Gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },

        Qualification: {
            type: String,
            required: true
        },

        Skills: [
            {
                type: String,
                trim: true
            }
        ],

        Bio: {
            type: String,
            default: ""
        },

        Role: {
            type: String,
            default: "JobSeeker"
        },
        ProfilePic: {
            type: String,
            default: "default.png"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("JobSeeker", JobSeekerSchema);