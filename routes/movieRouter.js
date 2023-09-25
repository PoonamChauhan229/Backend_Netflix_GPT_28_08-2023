const express = require('express');
const router = express.Router();
const axios = require('axios');

const { TrendingMovies, PopularMovies, NowPlayingMovies,TopRatedMovies,UpcomingMovies } = require("../model/movieModel");

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + process.env.TMDB_token,
  },
};

//console.log(process.env.Video_By_Movie_Id,process.env.Movie_Now_Playing,process.env.TMDB_token)

async function updateMovieInDatabase(movies,Model){
  for (const value of movies) {
    // Destructure the movie object
    const { original_title, overview, poster_path, id } = value;
    
   // console.log(original_title, overview, poster_path, id);
    
   // Check if the movie already exists in the database
   const existingMovie = await Model.findOne({ id: id });
   if (!existingMovie) {
    const videoTrailer=await fetchVideoDetails(id)
    console.log(videoTrailer)
    if (Array.isArray(videoTrailer) && videoTrailer.length > 0) {
      const newMovie = new Model({
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
  //console.log(videoUrl)
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
   await updateMovieInDatabase(nowPlayingMovies,NowPlayingMovies);
  const moviePlayingDetails =await NowPlayingMovies.find({})
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
    //console.log(trendingMovies)
    await updateMovieInDatabase(trendingMovies,TrendingMovies);
  const movieTrendingDetails =await TrendingMovies.find({})
    res.json(movieTrendingDetails);
  }
  catch(e){
    console.log(e)
  }
})

router.get('/popularmovies',async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Popular, API_OPTIONS);
    const popularMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(popularMovies,PopularMovies);
  const moviePopularDetails =await PopularMovies.find({})
    res.json(moviePopularDetails);
  }
  catch(e){
    console.log(e)
  }
})


router.get('/topratedmovies',async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Top_Rated, API_OPTIONS);
    const topratedMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(topratedMovies,TopRatedMovies);
  const movieTopRatedDetails =await TopRatedMovies.find({})
    res.json(movieTopRatedDetails);
  }
  catch(e){
    console.log(e)
  }
})



router.get('/upcomingmovies',async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Upcoming, API_OPTIONS);
    const upcomingMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(upcomingMovies,UpcomingMovies);
  const movieupcomingDetails =await UpcomingMovies.find({})
    res.json(movieupcomingDetails);
  }
  catch(e){
    console.log(e)
  }
})
module.exports = router;
