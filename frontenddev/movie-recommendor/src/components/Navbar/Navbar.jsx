import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const Navbar = ({ onLoginClick, onSignupClick, onProfileClick, onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const TMDB_HEADERS = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    Accept: "application/json",
  };

  // 🔍 Fetch movie suggestions when typing
  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          headers: TMDB_HEADERS,
          params: { query, language: "en-US", page: 1 },
        });
        setSuggestions(res.data.results.slice(0, 5));
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err.message);
      }
    };

    const delay = setTimeout(fetchSuggestions, 400); 
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (movieTitle = query) => {
    if (!movieTitle.trim()) return;
    onSearch(movieTitle);
    navigate("/recommended");
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="logo gradient-text">ROOVIE</div>

      <div className="search-wrapper">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowDropdown(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            🔍
          </button>
        </div>

        
        {showDropdown && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((movie) => (
              <li
                key={movie.id}
                className="suggestion-item"
                onClick={() => handleSearch(movie.title)}>
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`}
                    alt={movie.title}/>
                )}
                <span>{movie.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="nav-center">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/top-rated">Top Rated</Link></li>
          <li><Link to="/recommended">Recommended</Link></li>
          <li onClick={onProfileClick}>Profile</li>
        </ul>
      </div>

      <div className="nav-buttons">
        <button className="login-btn" onClick={onLoginClick}>Login</button>
        <button className="signup-btn" onClick={onSignupClick}>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
