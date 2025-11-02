import React, { useEffect, useState } from "react";
import { fetchTopRatedMovies } from "../api/movieService";
import MovieGrid from "../components/MovieGrid/MovieGrid";

const TopRated = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchTopRatedMovies();
      setMovies(data);
    };
    loadMovies();
  }, []);

  return (
    <div className="top-rated-page">
      <h1 className="section-title">⭐ Top Rated Movies</h1>
      <MovieGrid title="⭐ Top Rated" movies={movies} />
    </div>
  );
};

export default TopRated;
