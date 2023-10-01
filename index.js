const connection=require('./db/connection')
const dotenv=require('dotenv')
const express=require('express')
const app=express()
const cors=require('cors')

dotenv.config();

// cors
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend URL
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   }));
// app.use(cors())

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

  
  app.use(cors(corsOptions));
// app.use(cors())
// JSON
app.use(express.json())

app.use(express.urlencoded({ extended: true }));

// RouterAccess

const userRouter=require('./routes/userRouter')
app.use(userRouter)

const tmdbRouter=require('./routes/tmdbRouter')
app.use(tmdbRouter)

const openaiRouter=require('./routes/openaiRouter')
app.use(openaiRouter)


connection()
const PORT=process.env.PORT||8000
app.listen(PORT,()=>{
    console.log("Server started at PORT NO",PORT)
})