import React from "react";
import "./MovieGrid.css";

const MovieGrid = ({ title, movies = [] }) => {
  return (
    <section className="movie-grid-section">
      <h2 className="grid-title">{title}</h2>

      <div className="grid-container">
        {movies.length > 0 ? (
          movies.map((movie, i) => (
            <div key={i} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <div className="rating">
                <span className="star">★</span>
                <span className="score">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-movies">No movies found.</p>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
