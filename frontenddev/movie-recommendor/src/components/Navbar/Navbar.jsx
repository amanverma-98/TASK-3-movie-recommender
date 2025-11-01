import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLoginClick, onSignupClick, onProfileClick }) => {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="logo gradient-text">ROOVIE</div>


      <div className="search-box">
          <input type="text" placeholder="Search movies..." />
          <button className="search-btn">🔍</button>
        </div>

      {/* Middle: Nav links + search bar */}
      <div className="nav-center">
        <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
          <li><Link to="/top-rated">Top Rated</Link></li>
          <li><Link to="/recommended">Recommended</Link></li>
          <li onClick={onProfileClick}>Profile</li>
        </ul>

        
      </div>

      {/* Right: Auth buttons */}
      <div className="nav-buttons">
        <button className="login-btn" onClick={onLoginClick}>
          Login
        </button>
        <button className="signup-btn" onClick={onSignupClick}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
