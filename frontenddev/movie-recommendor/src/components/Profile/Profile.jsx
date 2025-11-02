import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate fetching user data (replace with API later)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      
      setUser({
        name: "Guest User",
        email: "guest@roovie.com",
        joined: "01 Nov 2025",
      });
    }
  }, []);

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2 className="profile-title gradient-text">My Profile</h2>

        <div className="profile-content">
          <div className="profile-avatar">👤</div>

          <div className="profile-field">
            <label>Name:</label>
            <p>{user?.name}</p>
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>

          <div className="profile-field">
            <label>Joined On:</label>
            <p>{user?.joined}</p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            onClose();
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
