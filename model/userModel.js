const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
})

// Generate the Token:
userSchema.methods.generateAuthToken = async function() {
    const secretKey = process.env.JWT_SECRET_KEY;
    const user = this;
    // console.log(user)
    // Generate the token
    const token = jwt.sign({ _id: user._id.toString() }, secretKey);
    
    // Token generated, add to the tokens array in usermodel
    //user.tokens = user.tokens.concat({ token });
    
    // Save the user to the database
    await user.save();
    
    return token;
}

const User=mongoose.model('User',userSchema)
module.exports=User;