const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth=require('../middleware/auth')
const OpenAI=require('openai')
const fetchWithSearchKeyword=require('../utils/fetchWithSearchKeyword')
const openai = new OpenAI({
    apiKey: process.env.Open_AI_API_Key, // defaults to process.env["OPENAI_API_KEY"]
  });
  
router.post('/getopenaidata',auth,async(req,res)=> {
    const gptQueryData =
      "Act as a Movie/Tv Show Recommendation system and suggest some movies/TvShows for the query : " +
      req.body.gptQuery+
      ". only give me names of 5 , comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
    const gptResults = await openai.chat.completions.create({
      messages: [{ role: 'user', content: gptQueryData}],
      model: 'gpt-3.5-turbo',
    });
    const getGptResults=gptResults?.choices[0]?.message.content.split(",")
    // console.log(gptResults.choices);
    const promiseArray= getGptResults.map((element)=>fetchWithSearchKeyword(element))

    const tmdbResults=await Promise.all(promiseArray)

    res.json({"gptSearchList":getGptResults,"tmdbSearchResults":tmdbResults})
  })
  

  

module.exports = router;