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
const TrendingMovies = mongoose.model("TrendingMovies", movieSchema);
const PopularMovies=mongoose.model("PopularMovies",movieSchema);
const NowPlayingMovies=mongoose.model("NowPlayingMovies",movieSchema);
const TopRatedMovies=mongoose.model("TopRatedMovies",movieSchema);
const UpcomingMovies=mongoose.model("UpcomingMovies",movieSchema);


module.exports = {TrendingMovies,PopularMovies,NowPlayingMovies,TopRatedMovies,UpcomingMovies};
