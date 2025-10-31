import React, { useState } from "react";
import "./Login.css";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
   // console.log("Login submitted:", formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h1 className="modal-title">Welcome Back</h1>
        <p className="modal-subtitle">
          Sign in to continue your cinematic journey
        </p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="modal-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
