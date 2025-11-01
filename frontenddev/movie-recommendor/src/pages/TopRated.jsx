import React from "react";
import MovieGrid from "../components/MovieGrid/MovieGrid";

const TopRated = () => {
  return (
    <div className="top-rated-page">
      <h1 className="section-title">⭐ Top Rated Movies</h1>
      <MovieGrid title="⭐ Top Rated" />
    </div>
  );
};

export default TopRated;
