const mongoose=require("mongoose");


const JobSchema = mongoose.Schema({
    Title:{
        type:String,
        required:true,
    },
    Desc:{
        type:String,
        required:true,
    },
    Location:{
        type:String,
        required:true,
    },
    CompanyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employer",
        required:true,
    },
    JobType:{
        type:String,
        required:true,
        enum:['Full Time','Part Time','Intern']
    },
    Salary:{
        type:String,
        required:true,
    },
    Status:{
        type:String,
        required:true,
        enum:['Active','Inactive']
    }
},{timestamps:true});

module.exports=mongoose.model('Job',JobSchema);