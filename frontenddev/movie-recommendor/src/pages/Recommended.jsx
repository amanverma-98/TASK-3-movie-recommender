import React from "react";
import MovieGrid from "../components/MovieGrid/MovieGrid";

const Recommended = ({ movies = [] }) => {
  return (
    <div className="recommended-page">
      <h1 className="section-title">🎯 Recommended Movies</h1>
      <MovieGrid title="🎯 Recommended" movies={movies} />
    </div>
  );
};

export default Recommended;
