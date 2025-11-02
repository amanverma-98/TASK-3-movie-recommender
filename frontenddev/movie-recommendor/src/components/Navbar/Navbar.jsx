import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLoginClick, onSignupClick, onProfileClick, onSearch }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query); // pass query up to App.jsx
      navigate("/recommended"); // move to recommended page
      setQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="logo gradient-text">ROOVIE</div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          🔍
        </button>
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
