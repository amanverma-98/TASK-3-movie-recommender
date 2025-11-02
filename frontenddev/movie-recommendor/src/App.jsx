import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import Home from "./pages/Home";
import TopRated from "./pages/TopRated";
import Recommended from "./pages/Recommended";
import Hero from "./components/Hero/Hero";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import { fetchMoviesWithPosters } from "./api/movieService";
import "./App.css";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [heroMovie, setHeroMovie] = useState(null);

  // 🔍 Handle search from Navbar
  const handleSearch = async (query) => {
    console.log("🔍 Searching for:", query);
    setSearchTitle(query);
    setLoading(true);

    const formattedTitle = query
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    const results = await fetchMoviesWithPosters(formattedTitle);
    setRecommendedMovies(results);
    setHeroMovie(results[0] || null);
    setLoading(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onProfileClick={() => setShowProfile(true)}
          onSearch={handleSearch}
        />

        <div className="main-content">
          {heroMovie && <Hero movie={heroMovie} />}

          <Routes>
            {/* ✅ Pass recommendedMovies & loading to Home */}
            <Route
              path="/"
              element={
                <Home
                  recommendedMovies={recommendedMovies}
                  loading={loading}
                />
              }
            />
            <Route path="/top-rated" element={<TopRated />} />
            <Route
              path="/recommended"
              element={
                <div className="recommended-page">
                  {loading && <p className="loading">Fetching recommendations...</p>}

                  {!loading && searchTitle && (
                    <h2 className="search-heading">
                      Showing recommendations for <span>"{searchTitle}"</span>
                    </h2>
                  )}

                  <MovieGrid title="🎯 Recommended" movies={recommendedMovies} />
                </div>
              }
            />
          </Routes>
        </div>

        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        {showSignup && <Signup onClose={() => setShowSignup(false)} />}
        {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      </div>
    </Router>
  );
};

export default App;
