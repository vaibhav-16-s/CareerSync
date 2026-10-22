const mongoose=require("mongoose");

const ApplicationSchema = new mongoose.Schema({

    JobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },

    JobSeekerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"JobSeeker",
        required:true
    },

    EmployerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employer",
        required:true
    },

    Resume:{
        type:String,
        required:true
    },

    Status:{
        type:String,
        enum:[
            "Pending",
            "Accepted",
            "Rejected",
        ],
        default:"Pending"
    }

},{timestamps:true});

module.exports=mongoose.model('Application',ApplicationSchema);