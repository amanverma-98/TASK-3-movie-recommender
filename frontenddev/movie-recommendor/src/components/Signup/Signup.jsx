import React, { useState } from "react";
import "./Signup.css";

const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // ⚠️ for inline validation message

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when typing
    setError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // If matched, proceed (you’ll later integrate backend API here)
    console.log("Signup successful:", formData);
    setError(""); // clear error on success
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h1 className="modal-title">Create Account</h1>
        <p className="modal-subtitle">
          Join <span>ROOVIE</span> and discover your next favorite movie
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ⚠️ Inline error message */}
          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="modal-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
