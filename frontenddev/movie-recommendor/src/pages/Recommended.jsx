import React from "react";
import MovieGrid from "../components/MovieGrid/MovieGrid";

const Recommended = () => {
  return (
    <div className="recommended-page">
      <h1 className="section-title">🎯 Recommended Movies</h1>
      <MovieGrid title="🎯 Recommended" />
    </div>
  );
};

export default Recommended;
