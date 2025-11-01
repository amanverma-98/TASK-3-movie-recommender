from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
from scipy import sparse
from fuzzywuzzy import process
import os
import pandas as pd
from typing import Optional
from pathlib import Path  # Recommended for path handling

# --- 1. Path Setup and FastAPI Initialization ---

# Define the directory where the API file (model1_api.py) is located
CURRENT_DIR = Path(__file__).resolve().parent

# Set BASE_DIR to the PARENT directory (TASK-3-movie-recommender) 
# assuming your data files are there.
BASE_DIR = CURRENT_DIR.parent

app = FastAPI(title="Movie Recommender API", version="2.0")

# CORS Middleware Setup
origins = ["*"]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Data Loading (Using Corrected BASE_DIR) ---
try:
    # Load data files from the parent directory
    movies = joblib.load(BASE_DIR / "/Users/dishantsingh/TASK-3-movie-recommender/ml_model/movies_df.joblib")
    details = pd.read_csv(BASE_DIR / "/Users/dishantsingh/TASK-3-movie-recommender/ml_model/movies_info.csv")  
    similarity = sparse.load_npz(BASE_DIR / "cos_sim_sparse.npz")
    
    # Feature Support: Prepare actor data for efficient searching
    details['top_3_actors_str'] = details['top_3_actors'].fillna('').astype(str).str.lower() 

except FileNotFoundError as e:
    # Raise a clear error if data files are missing
    raise RuntimeError(f"Data file not found. Check that all data files are in the directory: {BASE_DIR}. Error: {e}")
except KeyError as e:
    # Catching the common KeyError: 118 for version mismatch
    raise RuntimeError(
        f"Error loading model data (KeyError: {e}). "
        "This usually means a **library version mismatch** (Pandas/NumPy). "
        "Ensure your environment has the same library versions that created the .joblib file."
    )
except Exception as e:
    raise RuntimeError(f"An unexpected error occurred during data loading: {e}")


# --- 3. Basic Route ---
@app.get("/")
def home():
    """
    Basic home route to check if the API is running.
    """
    return {"message": "Movie Recommender API running! Data loaded successfully."}

# --- 4. Feature: Filtering Endpoint (/filter) ---
@app.get("/filter")
def filter_movies(
    content_rating: Optional[str] = Query(None, description="Filter by content rating (e.g., 'PG-13', 'R')."),
    tag: Optional[str] = Query(None, description="Filter by genre, keyword, or any tag."),
    limit: int = Query(20, gt=0, description="The maximum number of results to return.")
):
    """
    Allows filtering the movie database by content rating and/or specific tags (genre/keyword).
    Priority: Content Rating > Tag Filtering
    """
    
    filtered_df = details.copy()
    
    # 1. Content Rating Filter (High Priority)
    if content_rating:
        content_rating_lower = content_rating.lower()
        filtered_df = filtered_df[
            filtered_df['content_rating'].fillna('').astype(str).str.lower() == content_rating_lower
        ]
        
    # 2. Tag Filter
    if tag:
        tag_lower = tag.lower()
        filtered_df = filtered_df[
            filtered_df['genres'].fillna('').astype(str).str.lower().str.contains(tag_lower) |
            filtered_df['keywords'].fillna('').astype(str).str.lower().str.contains(tag_lower)
        ]

    if filtered_df.empty:
        raise HTTPException(status_code=404, detail="No movies found matching the specified criteria.")
    
    result_columns = ['title', 'content_rating', 'genres', 'overview', 'top_3_actors', 'director', 'keywords']
    results = filtered_df[result_columns].head(limit).to_dict(orient='records')
    
    return {
        "count": len(results),
        "filters_applied": {"content_rating": content_rating, "tag": tag},
        "results": results
    }

# --- 5. Modified Search Endpoint (/search/{query}) ---
@app.get("/search/{query}")
def search_movies(
    query: str,
    search_by: str = Query("title", description="Field to search: 'title' (default) or 'actor'.")
):
    """
    Searches movies either by title (default) or by actor name using fuzzy matching.
    """
    query = query.strip().lower()
    search_by_lower = search_by.lower()

    if search_by_lower == 'actor':
        search_target = details['top_3_actors_str'].tolist()
    else: 
        search_target = movies['title'].fillna("").astype(str).str.lower().tolist()

    try:
        results = process.extract(query, search_target, limit=10)
        
        matched_titles = []
        for match, score in results:
            if search_by_lower == 'actor':
                match_df = details[details['top_3_actors_str'].str.contains(match)]
                matched_titles.extend(match_df['title'].tolist())
            else:
                match_df = movies[movies['title'].str.lower() == match]
                matched_titles.extend(match_df['title'].tolist())

        matched_titles = list(set(matched_titles))
        matched_df = pd.DataFrame({'title': matched_titles})
        
        enriched = pd.merge(
            matched_df,
            details[['title', 'genres', 'overview', 'top_3_actors', 'keywords', 'director', 'content_rating']],
            on='title',
            how='left'
        )
        
        return {
            "search_mode": search_by_lower,
            "results": enriched.to_dict(orient='records')
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# --- 6. Recommendation Endpoint (/recommend/{movie_name}) ---
@app.get("/recommend/{movie_name}")
def recommend(movie_name: str):
    """
    Recommends top 5 similar movies based on the given movie name.
    """
    movie_name = movie_name.strip().lower()
    all_titles = movies['title'].str.lower().tolist()
    best_match, score = process.extractOne(movie_name, all_titles)
    
    if score < 60:
        raise HTTPException(status_code=404, detail=f"No close match found for '{movie_name}'") 
    
    index = movies[movies['title'].str.lower() == best_match].index[0]
    distances = list(enumerate(similarity[index].toarray().flatten()))
    movies_list = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]
    
    recommendations_df = movies.iloc[[i[0] for i in movies_list]][['title']]

    enriched = pd.merge(
        recommendations_df,
        details[['title', 'genres', 'overview', 'top_3_actors' , 'keywords' , 'director', 'content_rating']],
        on='title',
        how='left'
    )

    return {
        "searched_movie": movies.loc[index, 'title'],
        "match_score": score,
        "recommendations": enriched.to_dict(orient='records')
    }