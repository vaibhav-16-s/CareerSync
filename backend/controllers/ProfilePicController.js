exports.updateProfilePic = async(req,res)=>{

    try{


        const employer =
        await Employer.findByIdAndUpdate(

            req.user.id,

            {
                ProfilePic:req.file.filename
            },

            {
                new:true
            }

        );


        res.json({

            message:"Profile picture updated",
            employer

        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};