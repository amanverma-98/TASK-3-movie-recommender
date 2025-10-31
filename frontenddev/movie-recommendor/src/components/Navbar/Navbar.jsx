import React from "react";
import "./Navbar.css";

const Navbar = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav className="navbar">
     
      <div className="logo">
        <span className="gradient-text">ROOVIE</span>
      </div>

      
      <ul className="nav-links">
        
        <div className="search-box">
          <input type="text" placeholder="Search movies..." />
          <button className="search-btn">🔍</button>
        </div>

        <li>Home</li>
        <li>Top Rated</li>
        <li>Recommended</li>
        <li>Profile</li>
      </ul>

      
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
