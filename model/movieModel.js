const mongoose = require("mongoose");

const videoTrailerSchema = new mongoose.Schema({
    name: String,
    key: String,
    site: String,
    type: String,
  });

const movieSchema = new mongoose.Schema({
    original_title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    videoTrailer:[videoTrailerSchema],
  });

// movies
const TrendingMovies = mongoose.model("TrendingMovies", movieSchema);
const PopularMovies=mongoose.model("PopularMovies",movieSchema);
const NowPlayingMovies=mongoose.model("NowPlayingMovies",movieSchema);
const TopRatedMovies=mongoose.model("TopRatedMovies",movieSchema);
const UpcomingMovies=mongoose.model("UpcomingMovies",movieSchema);

//tvSeries

const AiringTodayTvSeries=mongoose.model("AiringTodayTvSeries",movieSchema);
const OnTheAirTvSeries=mongoose.model("OnTheAirTvSeries",movieSchema);
const PopularTvSeries=mongoose.model("PopularTvSeries",movieSchema);
const TopRatedTvSeries=mongoose.model("TopRatedTvSeries",movieSchema);

module.exports = {TrendingMovies,PopularMovies,NowPlayingMovies,TopRatedMovies,UpcomingMovies,AiringTodayTvSeries,OnTheAirTvSeries,PopularTvSeries,TopRatedTvSeries};
