const mongoose=require ("mongoose");

const UserSchema=new mongoose.Schema({
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    Role:{
        type:String,
        required:true,
    }
});

module.exports=mongoose.model('User',UserSchema);