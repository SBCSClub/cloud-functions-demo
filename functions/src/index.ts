import {onRequest} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/v2";
import axios from "axios";

export const getEpisode = onRequest({cors: true}, async (req, res) => {
  const episodeId = req.query.id || "tt28090181";
  logger.info(
      `Getting Episode with ID=${episodeId}`,
      {structuredData: true});

  const options = {
    method: "GET",
    url: `https://moviesdatabase.p.rapidapi.com/titles/episode/${episodeId}`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    const data = response.data["results"];
    res.set("Cache-Control", "public, max-age=60");
    res.json({data, error: false, timestamp: new Date().toISOString()});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: true});
  }
});
