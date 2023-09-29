const axios = require('axios');
const { API_OPTIONS } = require('./your-api-options'); // Import your API options here
const { YOUTUBE_API_KEY } = require('./your-config-file'); // Import your YouTube API key here

async function fetchVideoDetails(id, original_title) {
  try {
    let videoUrl;
    if (original_title) {
      videoUrl = process.env.Video_By_Movie_Id.replace('{movie_id}', id);
      console.log("movie url", videoUrl);
    } else {
      videoUrl = process.env.Video_By_Tv_Id.replace('{series_id}', id);
      console.log("tvseries url", videoUrl);
    }

    const videoResponse = await axios.get(videoUrl, API_OPTIONS);
    console.log("video", videoResponse.data.results);

    if (!videoResponse.data.results || videoResponse.data.results.length === 0) {
      console.log('No video trailers found. Fetching related videos from YouTube.');

      // Fetch related videos from YouTube using your API key
      const youtubeVideoUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&key=${YOUTUBE_API_KEY}`;
      const youtubeResponse = await axios.get(youtubeVideoUrl);

      if (youtubeResponse.data.items && youtubeResponse.data.items.length > 0) {
        const videoTrailers = youtubeResponse.data.items.map((video) => ({
          name: video.snippet?.title,
          key: video.id?.videoId,
          site: 'YouTube',
          type: 'Trailer', // You can set the type to 'Trailer' or another appropriate value
        }));

        return videoTrailers;
      }
    }

    const videoTrailers = videoResponse.data.results.map((video) => ({
      name: video?.name,
      key: video?.key,
      site: video?.site,
      type: video?.type,
    }));

    return videoTrailers;
  } catch (error) {
    console.error('Error while fetching video details for movie/TV series with ID:', id, error.message);
    return [];
  }
}

// Example usage for a movie
const movieId = 12345; // Replace with the actual movie ID
const isMovie = true;
fetchVideoDetails(movieId, 'Movie Title', isMovie)
  .then(videoTrailers => {
    console.log('Video Trailers:', videoTrailers);
  })
  .catch(err => {
    console.error('Error:', err);
  });

// Example usage for a TV series
const tvSeriesId = 67890; // Replace with the actual TV series ID
const isMovie = false;
fetchVideoDetails(tvSeriesId, 'TV Series Title', isMovie)
  .then(videoTrailers => {
    console.log('Video Trailers:', videoTrailers);
  })
  .catch(err => {
    console.error('Error:', err);
  });
