const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth=require('../middleware/auth')
const OpenAI=require('openai')

const openai = new OpenAI({
    apiKey: process.env.Open_AI_API_Key, // defaults to process.env["OPENAI_API_KEY"]
  });
  
router.post('/getopenaidata',async(req,res)=> {
    const gptQueryData =
      "Act as a Movie Recommendation system and suggest some movies for the query : " +
      req.body.gptQuery+
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
    const gptResults = await openai.chat.completions.create({
      messages: [{ role: 'user', content: gptQueryData}],
      model: 'gpt-3.5-turbo',
    });
  
    // console.log(gptResults.choices);
    res.json(gptResults.choices)
  })
  

  

module.exports = router;