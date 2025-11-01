import React from "react";
import "./Hero.css";

const Hero = ({ movie }) => {
  if (!movie) {
    return (
      <div className="hero-placeholder">
        <h1>Loading Featured Movie...</h1>
      </div>
    );
  }

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1280x720?text=No+Image";

  return (
    <header
      className="hero-section"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p className="hero-rating">⭐ {movie.vote_average}</p>
        </div>
      </div>
    </header>
  );
};

export default Hero;
