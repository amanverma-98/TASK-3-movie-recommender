//later we'll include the api here given by backend and ml
import axios from "axios";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const tmdb = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    accept: "application/json",
  },
});

export const fetchTopRatedMovie = async () => {
  try {
    const res = await tmdb.get("/movie/top_rated");
    const movie = res.data.results[0]; 
    return {
      title: movie.title,
      rating: movie.vote_average,
      overview: movie.overview,
      year: movie.release_date?.slice(0, 4),
      genre: "Sci-Fi • Action",
      backdrop: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
    };
  } catch (err) {
    console.error("Error fetching top-rated movie:", err);
    return null;
  }
};
