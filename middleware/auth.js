const jwt=require('jsonwebtoken')
const User=require('../model/userModel')

const auth=async(req,res,next)=>{
    
    try{
        console.log("Auth is running")
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log(token)
    
    // verify the token and proceed with authentication logic
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    console.log(decoded._id)
    const user =await User.findById(decoded._id)
    // console.log(user)
    req.user=user
    req.token=token
    
    
}catch(e){
    console.log(e,"error, Please Authenticate");
}
next()

    }
module.exports=auth;