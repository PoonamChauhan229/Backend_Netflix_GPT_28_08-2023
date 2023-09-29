router.get('/getalllist', auth, async (req, res) => {
  try {
    // Define an array of URLs to fetch data from
       const urls =[]
    for(var i=1;i<=5;i++){
      const newgetallListUrl=process.env.All_List_URL.replace('{pagenum}',i)
      urls.push(newgetallListUrl)
    }
    const allDetails=[]
    // Iterate through the URLs and fetch data
    for (const url of urls) {
      const response = await axios.get(url, API_OPTIONS);
      const data = response.data.results;

      // Assuming `updateMovieInDatabase` inserts data into the database
      await updateMovieInDatabase(data, GetAllList, null);

      allDetails.push(...data);
    }

    res.json(allDetails);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});
