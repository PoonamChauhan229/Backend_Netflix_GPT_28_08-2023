const axios = require("axios");
const fetchVideoDetails = require("./fetchVideoDetails");
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.TMDB_token,
  },
};

async function fetchWithSearchKeyword(keyword) {
  const movieName = process.env.Movie_Search_URL.replace("{keyword}", keyword);
  const tvName = process.env.TvShow_Search_URL.replace("{keyword}", keyword);

  try {
    const movieResponse = await axios.get(movieName, API_OPTIONS);
    const movieResponseArray = movieResponse.data.results;

    const tvResponse = await axios.get(tvName, API_OPTIONS);
    const tvResponseArray = tvResponse.data.results;

    // Flatten the array of arrays into a single array
    const flattenedMovieArray = movieResponseArray.flat();
    const flattenedTvArray = tvResponseArray.flat();

    const flattenedArray = [...flattenedMovieArray, ...flattenedTvArray];

    const detailsList = [];

    for (const oneMovie of flattenedArray) {
      const { id, original_title, overview, poster_path, original_name } = oneMovie;
      let videoDetails

      if (original_title) {
        videoDetails = await fetchVideoDetails(id,original_title,original_title)
      }else{
        videoDetails = await fetchVideoDetails(id,original_name,original_name)
      }

      // Combine movie and video details into an object and add it to the list
      const combinedDetails = {
        original_title,
        original_name,
        overview,
        poster_path,
        id,
        media_type: original_title?"movie":"tv",
        videoTrailer: videoDetails,
      };

      detailsList.push(combinedDetails);
    }

    return detailsList;
  } catch (error) {
    // Handle any errors, e.g., network issues or API errors
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to the calling function for further handling
  }
}

module.exports = fetchWithSearchKeyword;
