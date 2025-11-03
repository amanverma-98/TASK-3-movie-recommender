import React, { useEffect, useState } from "react";
import "./Hero.css";

const Hero = ({ movie }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (movie) {
      
      setFade(true);
      const timer = setTimeout(() => setFade(false), 800); // 0.8s fade
      return () => clearTimeout(timer);
    }
  }, [movie]);

  if (!movie) {
    return (<></>
   
    );
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://via.placeholder.com/1280x720?text=No+Image";

  return (
    <header
      className={`hero-section ${fade ? "fade-in" : ""}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>{movie.title}</h1>
          <p>{movie.overview?.slice(0, 150)}...</p>
          {movie.vote_average && (
            <p className="hero-rating">⭐ {movie.vote_average.toFixed(1)}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Hero;
