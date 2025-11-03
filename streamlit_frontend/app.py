import streamlit as st
import requests

# CONFIG VARIABLES
BASE_URL = "https://movie-recommender-api-pe1p.onrender.com"
TMDB_API_KEY = "85d56c54dccf4330ed1c3f13472694ed"
TMDB_BASE_URL = "https://api.themoviedb.org/3/search/movie"
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

st.set_page_config(page_title="🎬 Movie Recommender", page_icon="🎥", layout="wide")
st.title("🎬 Movie Recommender System")
st.markdown("Find and explore movies with AI-powered filters, posters & recommendations!")

# SIDEBAR FILTERS 
st.sidebar.header("🎛️ Filters")
genre = st.sidebar.text_input("Genre (e.g. Action, Comedy)")
actor = st.sidebar.text_input("Actor Name")
tag = st.sidebar.text_input("Tag or Keyword")
rating = st.sidebar.selectbox("Content Rating", ["", "U", "U/A", "Mature"])
priority = st.sidebar.selectbox("Filter Priority", ["", "genre", "actor", "tag", "rating"])

tab1, tab2 = st.tabs(["🎯 Search Movies", "🎥 Recommend Similar"])

# FUNCTIONS
@st.cache_data(ttl=300)  
def call_api(endpoint):
    """Call FastAPI backend"""
    try:
        url = f"{BASE_URL}{endpoint}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"❌ API Error: {response.status_code}")
            return None
    except Exception as e:
        st.error(f"⚠️ Connection failed: {e}")
        return None


@st.cache_data(ttl=300)
def get_poster(title):
    """Fetch poster from TMDB"""
    if not TMDB_API_KEY:
        return None
    try:
        params = {"api_key": TMDB_API_KEY, "query": title}
        res = requests.get(TMDB_BASE_URL, params=params)
        data = res.json()
        if data.get("results"):
            poster_path = data["results"][0].get("poster_path")
            if poster_path:
                return POSTER_BASE_URL + poster_path
        return None
    except:
        return None


def get_movie_suggestions(query):
    """Fetch top 10 movie suggestions for dropdown"""
    if not query:
        return []
    endpoint = f"/search/{query}"
    data = call_api(endpoint)
    if data and "results" in data:
        return [m["title"] for m in data["results"] if "title" in m]
    return []


def build_url(base, **params):
    """Helper to append params to FastAPI endpoint"""
    query_str = "&".join([f"{k}={v}" for k, v in params.items() if v])
    return f"{base}?{query_str}" if query_str else base


# SEARCH TAB (Dynamic Search Input)
with tab1:
    st.subheader("🔍 Search Movies")

    # Text input (user types here)
    user_query = st.text_input("🎬 Type a movie name:", placeholder="Start typing...")

    # Fetch suggestions dynamically from API as user types
    suggestions = get_movie_suggestions(user_query) if user_query else []

    # Show a dropdown of matching movies
    selected_movie = None
    if suggestions:
        selected_movie = st.selectbox(
            "Select from suggestions:",
            suggestions,
            key="movie_dropdown"
        )

    # If a movie is selected, use it; otherwise fall back to the typed query
    final_movie = selected_movie or user_query

    if st.button("Search"):
        if not final_movie:
            st.warning("Please enter or select a movie.")
        else:
            endpoint = build_url(
                f"/search/{final_movie}",
                genre=genre,
                actor=actor,
                tag=tag,
                content_rating=rating,
                filter_priority=priority,
            )
            data = call_api(endpoint)
            if data and "results" in data:
                results = data["results"]
                if not results:
                    st.info("No movies found.")
                else:
                    st.success(f"Found {len(results)} movies 🎬")
                    for movie in results:
                        col1, col2 = st.columns([1, 3])
                        with col1:
                            poster = get_poster(movie["title"])
                            st.image(
                                poster or "https://via.placeholder.com/200x300?text=No+Image",
                                width=200,
                            )
                        with col2:
                            st.subheader(movie["title"])
                            st.write(f"🎭 **Genre:** {movie.get('genres', 'N/A')}")
                            st.write(f"⭐ **Rating:** {movie.get('content_rating', 'N/A')} | 🔥 **Popularity:** {movie.get('popularity', 'N/A')}")
                            st.write(f"🎬 **Top Actors:** {movie.get('top_3_actors', 'N/A')}")
                            st.write(f"🎥 **Director:** {movie.get('director', 'N/A')}")
                            st.write(f"🧠 **Overview:** {movie.get('overview', 'N/A')}")
                        st.divider()


# RECOMMEND TAB (Dynamic Search Input)
with tab2:
    st.subheader("🎞️ Recommend Similar Movies")

    # Text input (user types movie name or keyword)
    rec_query = st.text_input("🎬 Type a movie name or keyword:", placeholder="Start typing...", key="rec_input")

    # Fetch suggestions dynamically from API as user types
    rec_suggestions = get_movie_suggestions(rec_query) if rec_query else []

    # Show a dropdown of matching movies
    selected_rec_movie = st.selectbox(
        "Select from suggestions:",
        rec_suggestions,
        key="rec_dropdown"
    ) if rec_suggestions else None

    # Final movie to send to API
    final_rec_movie = selected_rec_movie or rec_query

    if st.button("Get Recommendations"):
        if not final_rec_movie:
            st.warning("Please enter or select a movie.")
        else:
            endpoint = build_url(
                f"/recommend/{final_rec_movie}",
                genre=genre,
                actor=actor,
                tag=tag,
                content_rating=rating,  # now content_rating works here
                filter_priority=priority,
            )

            data = call_api(endpoint)
            if data and "recommendations" in data:
                recs = data["recommendations"]
                st.subheader(f"🎬 Recommendations for **{data['searched_movie']}**")

                if not recs:
                    st.info("No recommendations found.")
                else:
                    st.success(f"Found {len(recs)} similar movies 🎯")
                    for movie in recs:
                        col1, col2 = st.columns([1, 3])
                        with col1:
                            poster = get_poster(movie["title"])
                            st.image(
                                poster or "https://via.placeholder.com/200x300?text=No+Image",
                                width=200
                            )
                        with col2:
                            st.subheader(movie["title"])
                            st.write(f"🎭 **Genre:** {movie.get('genres', 'N/A')}")
                            st.write(f"⭐ **Rating:** {movie.get('content_rating', 'N/A')} | 🔥 **Popularity:** {movie.get('popularity', 'N/A')}")
                            st.write(f"🎬 **Top Actors:** {movie.get('top_3_actors', 'N/A')}")
                            st.write(f"🎥 **Director:** {movie.get('director', 'N/A')}")
                            st.write(f"🧠 **Overview:** {movie.get('overview', 'N/A')}")
                        st.divider()
