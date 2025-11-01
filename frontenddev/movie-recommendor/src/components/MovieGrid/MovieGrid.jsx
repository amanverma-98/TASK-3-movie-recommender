import React from "react";
import "./MovieGrid.css";

const MovieGrid = ({ title }) => {
  const movies = []; // 🟡 empty for now — will fill when API added

  return (
    <section className="movie-grid-section">
      <h2 className="grid-title">{title}</h2>
      {movies.length === 0 ? (
        <p className="no-movies">No movies found.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <div className="poster-placeholder">🎬</div>
              <h3>{movie.title}</h3>
              <p>⭐ {movie.rating}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
