const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth=require('../middleware/auth')
const { TrendingMovies, PopularMovies, NowPlayingMovies,TopRatedMovies,UpcomingMovies,AiringTodayTvSeries,OnTheAirTvSeries,PopularTvSeries,TopRatedTvSeries } = require("../model/tmdbModel");
const watchList =require('../model/watchlistModel')
const fetchVideoDetails=require('../utils/fetchVideoDetails')
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + process.env.TMDB_token,
  },
};

//console.log(process.env.Video_By_Movie_Id,process.env.Movie_Now_Playing,process.env.TMDB_token)
// console.log("URL",process.env.Video_By_Movie_Id.replace('{id}', "787878"))


async function updateMovieInDatabase(movies, Model, type) {
  for (const value of movies) {
    const { original_title, original_name, overview, poster_path, id } = value;

    // Fetch videoTrailer data
    let videoTrailer;

    if(type==="movie"){
     videoTrailer = await fetchVideoDetails(id, original_title,original_title)
    }else{
    videoTrailer = await fetchVideoDetails(id, null,original_name)
    }

    // Check if the movie already exists in the database
    const existingMovie = await Model.findOne({ id: id });

    if (!existingMovie) {
      const newMovie = new Model({
        original_title,
        original_name,
        overview,
        poster_path,
        id,
        type,
      });

      // Save videoTrailer data if available
      if (Array.isArray(videoTrailer) && videoTrailer.length > 0) {
        newMovie.videoTrailer = videoTrailer;
      }

      await newMovie.save();
    }
  }
}

// nowplaying Movies Route
router.get('/nowplayingmovies',auth,async (req, res) => {
 // console.log("Headers",req.headers)
  try {
    const response = await axios.get(process.env.Movie_Now_Playing, API_OPTIONS);
    const nowPlayingMovies=response.data.results 
   // console.log(response.data);
  //await Movie.insertMany(nowPlayingMovies)
   await updateMovieInDatabase(nowPlayingMovies,NowPlayingMovies,"movie");
  const moviePlayingDetails =await NowPlayingMovies.find({})
    res.json(moviePlayingDetails);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

router.get('/trendingmovies',auth,async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Trending, API_OPTIONS);
    const trendingMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(trendingMovies,TrendingMovies,"movie");
  const movieTrendingDetails =await TrendingMovies.find({})
    res.json(movieTrendingDetails);
  }
  catch(e){
    console.log(e)
  }
})

router.get('/popularmovies',auth,async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Popular, API_OPTIONS);
    const popularMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(popularMovies,PopularMovies,"movie");
  const moviePopularDetails =await PopularMovies.find({})
    res.json(moviePopularDetails);
  }
  catch(e){
    console.log(e)
  }
})


router.get('/topratedmovies',auth,async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Top_Rated, API_OPTIONS);
    const topratedMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(topratedMovies,TopRatedMovies,"movie");
  const movieTopRatedDetails =await TopRatedMovies.find({})
    res.json(movieTopRatedDetails);
  }
  catch(e){
    console.log(e)
  }
})

router.get('/upcomingmovies',auth,async(req,res)=>{
  try {
    const response = await axios.get(process.env.Movie_Upcoming, API_OPTIONS);
    const upcomingMovies=response.data.results
    //console.log(trendingMovies)
    await updateMovieInDatabase(upcomingMovies,UpcomingMovies,"movie");
    const movieupcomingDetails =await UpcomingMovies.find({})
    res.json(movieupcomingDetails);
  }
  catch(e){
    console.log(e)
  }
})

// TV Shows
router.get('/airingtodaytvseries',auth,async(req,res)=>{
  try{
    const response=await axios.get(process.env.TV_Series_Airing_Today,API_OPTIONS);
    const airingtodaytvseries=await response.data.results
    await updateMovieInDatabase(airingtodaytvseries,AiringTodayTvSeries,"tvseries");
    const airingtodaytvseriesDetails=await AiringTodayTvSeries.find({})
    res.json(airingtodaytvseriesDetails)
  }catch(e){
    console.log(e)
  }
})

router.get('/ontheairtvseries',auth,async(req,res)=>{
  try{
    const response=await axios.get(process.env.TV_Series_On_The_Air,API_OPTIONS);
    const ontheairtvseries=await response.data.results
    await updateMovieInDatabase(ontheairtvseries,OnTheAirTvSeries,"tvseries");
    const ontheairtvseriesDetails=await OnTheAirTvSeries.find({})
    res.json(ontheairtvseriesDetails)
  }catch(e){
    console.log(e)
  }
})

router.get('/populartvseries',auth,async(req,res)=>{
  try{
    const response=await axios.get(process.env.TV_Series_Popular,API_OPTIONS);
    const populartvseries=await response.data.results
    await updateMovieInDatabase(populartvseries,PopularTvSeries,"tvseries");
    const populartvseriesDetails=await PopularTvSeries.find({})
    res.json(populartvseriesDetails)
  }catch(e){
    console.log(e)
  }
})


router.get('/topratedtvseries',auth,async(req,res)=>{
  try{
    const response=await axios.get(process.env.TV_Series_Top_Rated,API_OPTIONS);
    const topratedtvseries=await response.data.results
    await updateMovieInDatabase(topratedtvseries,TopRatedTvSeries,"tvseries");
    const topratedtvseriesDetails=await TopRatedTvSeries.find({})
    res.json(topratedtvseriesDetails)
  }catch(e){
    console.log(e)
  }
})

//watchlist 
router.post('/watchlist/add',auth,async(req,res)=>{
  const watchListData=new watchList({
    ...req.body,
    owner:req.user._id
  })
try{
  await watchListData.save()
  res.send(watchListData)
}catch(e){
  res.send(e)
}

})
router.get('/watchlist',auth,async(req,res)=>{
 try{
  const watchlistgetData=await watchList.find({})
  res.send(watchlistgetData)
}catch(e){
  res.send(e)
}

})
module.exports = router;
