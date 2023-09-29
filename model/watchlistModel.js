const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
    original_title: {
      type: String,
    },
    original_name:{
      type:String,
      default:"Random"
    },
    overview: {
      type: String,
    },
    poster_path: {
      type: String,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    videoTrailer:{
      type: String,
    },
    type:{
      type: String,
      required:true
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    }
  });

// movies
const watchList = mongoose.model("watchList", watchListSchema);
module.exports=watchList;