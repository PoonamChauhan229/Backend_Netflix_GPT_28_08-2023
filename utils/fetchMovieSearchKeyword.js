const axios=require('axios')   
// const API_OPTIONS = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: 'Bearer ' + process.env.TMDB_token,
//     }}

// async function fetchMovieSearchKeyword(movie) {
//   const movieName=process.env.Movie_Search_URL.replace('{keyword}',movie)
//     const movieResponse=await axios.get(movieName,API_OPTIONS)

//     return movieResponse.data.results;
//   }

//   module.exports=fetchMovieSearchKeyword;
const fetchVideoDetails=require('../utils/fetchVideoDetails')
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + process.env.TMDB_token,
  }
};


async function fetchMovieSearchKeyword(movieList) {
  try {
    const movieDetailsList = [];

    for (const movie of movieList) {
      const movieName = process.env.Movie_Search_URL.replace('{keyword}', movie);
      const movieResponse = await axios.get(movieName, API_OPTIONS);

      const movieDetails = movieResponse.data.results;
      
      if (movieDetails.length > 0) {
        // Assuming you want to use details of the first movie found
        const { id, original_title, searchKey } = movieDetails[0];

        // Fetch video details
        const videoDetails = await fetchVideoDetails(id, original_title, searchKey);

        // Combine movie and video details into an object and add it to the list
        const combinedDetails = {
          
          movie: movieDetails,
          video: videoDetails,
        };

        movieDetailsList.push(combinedDetails);
      }
    }

    return movieDetailsList;
  } catch (error) {
    console.error('Error while fetching movie and video details:', error.message);
    return null;
  }
}

module.exports = fetchMovieSearchKeyword;
