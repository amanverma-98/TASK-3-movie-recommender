import React from "react";
import "./Hero.css";

const Hero = ({ movie }) => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), #0b0b0d 90%), url(${movie.backdrop})`,
      }}
    >
      <div className="hero-content">
        <div className="hero-badge">Top Movie of the Week</div>
        <h1 className="hero-title">{movie.title}</h1>
        <div className="hero-meta">
          <span className="rating">⭐ {movie.rating.toFixed(1)}/10</span>
          <span>• {movie.year}</span>
          <span>• {movie.genre}</span>
        </div>
        <p className="hero-description">{movie.overview}</p>
      </div>
    </section>
  );
};

export default Hero;
