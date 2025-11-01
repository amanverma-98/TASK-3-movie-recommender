import React from "react";
import Hero from "../components/Hero/Hero";
import MovieGrid from "../components/MovieGrid/MovieGrid";

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <MovieGrid title="⭐ Top Rated" />
      <MovieGrid title="🎯 Recommended" />
    </div>
  );
};

export default Home;
