import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import { fetchTopRatedMovie } from "./api/movieService";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [topMovie, setTopMovie] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      const movie = await fetchTopRatedMovie();
      setTopMovie(movie);
    };
    loadMovie();
  }, []);

  return (
    <div className="App">
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      {topMovie && <Hero movie={topMovie} />}

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </div>
  );
}

export default App;
