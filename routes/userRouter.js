const User=require('../model/userModel')
const express=require('express')
const router=express.Router()
const Joi=require('joi')
const bcrypt=require('bcrypt')
const auth=require('../middleware/auth')

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
    const token=await user.generateAuthToken()
    res.status(201).send({user,token})
   
})

// SignIn /Login Route:
router.post('/users/signin', async (req, res) => {
try {
    // Input validation using Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Compare the PASSWORD
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate and send a token
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports=router;