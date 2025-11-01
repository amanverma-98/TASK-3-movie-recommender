import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "15f79feff623872b47ed694568a526e7";

export const fetchTopRatedMovie = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    // Return one top movie
    return res.data.results[0];
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
