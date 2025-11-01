import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";

import Home from "./pages/Home";
import TopRated from "./pages/TopRated";
import Recommended from "./pages/Recommended";

import "./App.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Router>
      <div className="App">
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onProfileClick={() => setShowProfile(true)}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/recommended" element={<Recommended />} />
        </Routes>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        {showSignup && <Signup onClose={() => setShowSignup(false)} />}
        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </div>
    </Router>
  );
};

export default App;
