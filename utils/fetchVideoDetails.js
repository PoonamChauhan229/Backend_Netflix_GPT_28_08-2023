

const axios=require('axios')   
const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + process.env.TMDB_token,
    }}

async function fetchVideoDetails(id, original_title,searchKey) {
    
    //console.log(id,original_title)
    try {
      let videoUrl;
      if (original_title) {
        videoUrl = process.env.Video_By_Movie_Id.replace('{movie_id}', id);
       // console.log("movie url",videoUrl)
      } else {
        videoUrl = process.env.Video_By_Tv_Id.replace('{series_id}', id);
        //console.log("tvseries url",videoUrl)
      }
  
      const videoResponse = await axios.get(videoUrl,API_OPTIONS);
     // console.log("video",videoResponse.data.results)

      if(!videoResponse.data.results || videoResponse.data.results.length==0){
       // console.log(searchKey)
        console.log('No video trailers found. Fetching related videos from YouTube.');
        //console.log(process.env.YOUTUBE_URL.replace('{searchKey}',searchKey))
        // Fetch related videos from YouTube using your API key
        const youtubeVideoUrl=process.env.YOUTUBE_URL.replace('{searchKey}', searchKey);

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
      // return [];
    }
  }

  module.exports=fetchVideoDetails