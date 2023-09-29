const jwt=require('jsonwebtoken')
const User=require('../model/userModel')

const auth=async(req,res,next)=>{
    
    try{
    console.log("Auth is running")
    //console.log(req.headers)
    // const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token)

    // Check if the 'Authorization' header exists in the request
    const authHeader = req.header('Authorization');
   // console.log(authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication failed: Missing or invalid token' });
    }

    // Extract the token from the 'Authorization' header
    const token = authHeader.replace('Bearer ', '');
    
    // verify the token and proceed with authentication logic
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
    //console.log(decoded._id)
    const user =await User.findById(decoded._id)
    // console.log(user)

    if (!user) {
        // If the user is not found, return an error response
        return res.status(401).json({ error: 'Authentication failed' });
    }
    req.user=user
    req.token=token
    
 
}catch(e){
    console.log(e,"error, Please Authenticate");
}

next()
    }
module.exports=auth;