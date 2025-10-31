from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
from scipy import sparse
from fuzzywuzzy import process

app = FastAPI(title="Movie Recommender API", version="2.0")

# hm yha pr CORSmiddleware ka use kr rhe coz front-end or any other client se request aayegi to wo allow ho jaye
origins = ["*"]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

movies = joblib.load("C:\\Users\\av979\\OneDrive\\Desktop\\Movie-recommender\\TASK-3-movie-recommender\\TASK-3-movie-recommender\\ml_model\\movies_df.joblib")
similarity = sparse.load_npz("C:\\Users\\av979\\OneDrive\\Desktop\\Movie-recommender\\TASK-3-movie-recommender\\TASK-3-movie-recommender\\ml_model\\cos_sim_sparse.npz")

@app.get("/")
def home():
    return {"message": "Movie Recommender API running!"}


@app.get("/recommend/{movie_name}")
def recommend(movie_name: str):
    movie_name = movie_name.strip().lower()
    all_titles = movies['title'].str.lower().tolist()
    best_match, score = process.extractOne(movie_name, all_titles)
    
    if score < 60:
        raise HTTPException(status_code=404, detail=f"No close match found for '{movie_name}'")
    
    index = movies[movies['title'].str.lower() == best_match].index[0]
    distances = list(enumerate(similarity[index].toarray().flatten()))
    movies_list = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]
    
    recommendations = movies.iloc[[i[0] for i in movies_list]][['title']].to_dict(orient='records')
    
    return {
        "searched_movie": movies.loc[index, 'title'],
        "match_score": score,
        "recommendations": recommendations
    }
