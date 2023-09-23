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
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
