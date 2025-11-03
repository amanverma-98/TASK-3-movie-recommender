import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid/MovieGrid";
import { fetchTopRatedMovies } from "../api/movieService";

const Home = ({ recommendedMovies, loading }) => {
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const loadTopRated = async () => {
      const data = await fetchTopRatedMovies();
      setTopRated(data);
    };
    loadTopRated();
  }, []);

  return (
    <div className="home-page">
      <MovieGrid title="⭐ Top Rated Movies" movies={topRated} />

      {/* ✅ Show Recommended only when not loading and there are movies */}
      {!loading && recommendedMovies && recommendedMovies.length > 0 && (
        <MovieGrid title="🎯 Recommended" movies={recommendedMovies} />
      )}
    </div>
  );
};

export default Home;
