import axios from "axios";

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_BASE_URL;
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

const TMDB_HEADERS = {
  Authorization: `Bearer ${TMDB_TOKEN}`,
  Accept: "application/json",
};


export const fetchRecommendedMovies = async (title = "The Avengers") => {
  try {
    const endpoint = `${ML_API_BASE_URL}/recommend/${encodeURIComponent(title)}`;
    console.log("🌐 Calling ML API at:", endpoint); // 🔍 New log line

    const res = await axios.get(endpoint);
    console.log("🎯 ML API Response:", res.data);

    const data = res.data.recommendations || [];
    return data;
  } catch (err) {
    console.error("❌ Error fetching from ML API:", err.response?.data || err.message);
    return [];
  }
};

/**
 * 2️⃣ Fetch top-rated movies from TMDB
 */
export const fetchTopRatedMovies = async () => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      headers: TMDB_HEADERS,
      params: { language: "en-US", page: 1 },
    });

    console.log("⭐ Top Rated Movies:", res.data.results);
    return res.data.results;
  } catch (err) {
    console.error("❌ Error fetching top-rated movies:", err.response?.data || err.message);
    return [];
  }
};

/**
 * 3️⃣ Fetch a poster by title from TMDB
 */
export const fetchPosterByTitle = async (title) => {
  try {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      headers: TMDB_HEADERS,
      params: { query: title, language: "en-US" },
    });

    return res.data.results?.[0]?.poster_path || null;
  } catch (err) {
    console.error(`⚠️ No poster found for ${title}:`, err.message);
    return null;
  }
};

/**
 * 4️⃣ Combine ML movies with TMDB posters
 */
export const fetchMoviesWithPosters = async (title) => {
  const mlMovies = await fetchRecommendedMovies(title);
  const combined = [];

  // Fallback to TMDB Popular movies if ML returns empty
  if (!mlMovies.length) {
    console.warn("⚠️ No ML recommendations found, loading fallback popular movies...");
    const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      headers: TMDB_HEADERS,
      params: { language: "en-US", page: 1 },
    });
    return res.data.results;
  }

  for (const movie of mlMovies) {
    const posterPath = await fetchPosterByTitle(movie.title);
    combined.push({
      ...movie,
      poster_path: posterPath,
    });
  }

  console.log("✅ Combined ML + TMDB Data:", combined);
  return combined;
};
