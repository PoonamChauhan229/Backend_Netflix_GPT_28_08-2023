router.get('/getalllist', auth, async (req, res) => {
  try {
    // Define an array of URLs to fetch data from
    const urls = [];
    for (var i = 1; i <= 5; i++) {
      const newgetallListUrl = process.env.All_List_URL.replace('{pagenum}', i);
      urls.push(newgetallListUrl);
    }
    const allDetails = [];

    // Iterate through the URLs and fetch data
    for (const url of urls) {
      const response = await axios.get(url, API_OPTIONS);
      const data = response.data.results;
      const getallId=response.data.results;
         
      movievideoUrl = process.env.Video_By_Movie_Id.replace('{movie_id}', getallId);
      const videoallresponse=await axios.get(movievideoUrl,API_OPTIONS)  
      if(!videoallresponse.data.results || videoallresponse.data.results.length==0){
        videoUrl = process.env.Video_By_Tv_Id.replace('{series_id}', getallId);
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
      const videoTrailers = videoallresponse.data.results.map((video) => ({
        name: video?.name,
        key: video?.key,
        site: video?.site,
        type: video?.type,
      }));
  
      return videoTrailers;
     

      allDetails.push(...data);
    }

    // Assuming `updateMovieInDatabase` inserts data into the database
    await updateMovieInDatabase(allDetails, GetAllList, null);
    console.log(allDetails)
    res.json(allDetails);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});