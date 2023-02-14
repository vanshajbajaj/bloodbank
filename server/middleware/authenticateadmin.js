const jwt=require('jsonwebtoken');
const User=require('./../models/User');

const authenticateadmin=async (req,res,next)=>{

    try{

        const token=req.cookies.jwtoken;
        const verifytoken=jwt.verify(token,"MYNAMEISVANSHAJBAJAJANDIAMNOTATERRORIST");

        const rootUser=await User.findOne({_id:verifytoken._id,'tokens.token':token});

        if(!rootUser || rootUser.name!="Admin" || rootUser.email!="admin@gmail.com"){throw new Error("User not found")};

        req.token=token; 
        req.rootUser=rootUser;
        req.userID=rootUser._id;

        // console.log(rootUser);

        next();

    }
    catch(err){
        res.status(401).send('Unauthorized:No token found');
        console.log(err)
    }

}

module.exports=authenticateadmin;