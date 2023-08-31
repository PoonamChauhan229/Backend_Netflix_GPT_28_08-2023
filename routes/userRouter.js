const User=require('../model/userModel')
const express=require('express')
const router=express.Router()
const Joi=require('joi')
const bcrypt=require('bcrypt')

// Sample Route
router.get('/netflix',async (req,res)=>{
    res.send('Welcome to the Netflix clone')
})

// SignUp Route:
router.post('/users/signup',async(req,res)=>{

    const schema=Joi.object({
        name:Joi.string().pattern(/^[a-zA-Z0-9]+$/),
        email:Joi.string().pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/),
        password:Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    })
    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // duplicate email id
    let user=await User.findOne({email:req?.body?.email})
    if(user) return res.status(400).send("User already exists")

    //hashing the password:
    const salt= await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt)

     user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    await user.save()
    res.send(user)
})

// SignIn /Login Route:
router.post('/users/signin',async(req,res)=>{

    const schema=Joi.object({
        email:Joi.string().pattern(/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/),
        password:Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    })
    const {error}=schema.validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //verifying the email
    let user=await User.find({email:req?.body?.email})
    console.log(user[0])
    if(!user) return res.status(400).send("Email address Invalid")
    

    //comparing the PASSWORD
    const isValidPassword=await bcrypt.compare(req.body.password,user[0].password)
    console.log(isValidPassword)
    if(!isValidPassword) return res.status(400).send("Password Invalid")
    res.send(user)

})

module.exports=router;