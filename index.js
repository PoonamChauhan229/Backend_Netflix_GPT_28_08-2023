const connection=require('./db/connection')
const dotenv=require('dotenv')
const express=require('express')
const app=express()


dotenv.config();


connection()
const PORT=process.env.PORT||8000
app.listen(PORT,()=>{
    console.log("Server started at PORT NO",PORT)
})