const express = require('express');
const router = express.Router();
const axios = require('axios');
const Movie=require('../model/movieModel');

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + process.env.TMDB_token,
  },
};

//console.log(process.env.Video_By_Movie_Id,process.env.Movie_Now_Playing,process.env.TMDB_token)

async function updateMovieInDatabase(movies){
  for (const value of movies) {
    // Destructure the movie object
    const { original_title, overview, poster_path, id } = value;
    
   // console.log(original_title, overview, poster_path, id);
    
   // Check if the movie already exists in the database
   const existingMovie = await Movie.findOne({ id: id });
   if (!existingMovie) {
    const videoTrailer=await fetchVideoDetails(id)
    console.log(videoTrailer)
    if (Array.isArray(videoTrailer) && videoTrailer.length > 0) {
      const newMovie = new Movie({
        original_title,
        overview,
        poster_path,
        id,
        videoTrailer: videoTrailer,
      });
      await newMovie.save();
   }
   else {
    console.error('No valid video trailer data found.');
  }
  }
  }
}

async function fetchVideoDetails(movie_id){
  const videoUrl=process.env.Video_By_Movie_Id.replace('{movie_id}',movie_id)
  console.log(videoUrl)
  const videoResponse=await axios.get(videoUrl,API_OPTIONS)
 // console.log(videoResponse.data.results)
  if(videoResponse.data.results.length<0) return;
  const videoTrailers = videoResponse.data.results.map((video) => ({
    name: video.name,
    key: video.key,
    site: video.site,
    type: video.type,
  }));

  return videoTrailers; 
}


// nowplaying Movies Route
router.get('/nowplayingmovies', async (req, res) => {
  try {
    const response = await axios.get(process.env.Movie_Now_Playing, API_OPTIONS);
    const nowPlayingMovies=response.data.results 
   // console.log(response.data);
  //await Movie.insertMany(nowPlayingMovies)
   await updateMovieInDatabase(nowPlayingMovies);
  const moviePlayingDetails =await Movie.find({})
    res.json(moviePlayingDetails);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

router.get('/trendingmovies',async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Trending, API_OPTIONS);
    const trendingMovies=response.data.results
    console.log(trendingMovies)
    res.json(trendingMovies)
  }
  catch(e){
    console.log(e)
  }
})

module.exports = router;
