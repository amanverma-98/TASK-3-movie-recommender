from fastapi import FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
from scipy import sparse
from fuzzywuzzy import process
import os
import pandas as pd

app = FastAPI(title="Movie Recommender API", version="2.0")
BASE_DIR = os.path.dirname(__file__)

# hm yha pr CORSmiddleware ka use kr rhe coz front-end or any other client se request aayegi to wo allow ho jaye
origins = ["*"]  
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

movies = joblib.load(os.path.join(BASE_DIR, "movies_df.joblib"))
details = pd.read_csv(os.path.join(BASE_DIR, "movies_info.csv"))  # path to metadata file
similarity = sparse.load_npz(os.path.join(BASE_DIR, "cos_sim_sparse.npz"))
# os ka use kr rhe h taaki ye code kisi bhi system pr chale bina path k issue ke

@app.get("/")
def home():
    return {"message": "Movie Recommender API running!"}
# basic home route jaha pr api chal rhi h ye check kr skte h

@app.get("/search/{query}")
def search_movies(query: str):
    query = query.strip().lower()
    all_titles = movies['title'].fillna("").astype(str).str.lower().tolist()
    # title ko lower case me convert kr rhe taaki matching me case sensitivity na hoaur list m store kra h 
    try:
        results = process.extract(query, all_titles, limit=10)
        # results m tuple hoga (matched_title, score)
        matched_indices = [
            i 
            for (match, score) in results 
            for i in movies[movies['title'].str.lower() == match].index
        ]
        matched_df = movies.iloc[matched_indices][['title']]
        enriched = pd.merge(
            matched_df,
            details[['title', 'genres', 'overview', 'top_3_actors', 'keywords', 'director']],
            on='title',
            how='left'
        )
        enriched['match_score'] = [
            score for (match, score) in results for i in movies[movies['title'].str.lower() == match].index
        ]
        return {"results": enriched.to_dict(orient='records')}
    
    except Exception as e:
        return {"error": f"Search failed: {str(e)}"}
    #hmne try except isliye lgaya taaki agar koi error aaye to wo handle ho jaye wrna internal server error de rha tha

@app.get("/recommend/{movie_name}")
def recommend(movie_name: str):
    movie_name = movie_name.strip().lower()    # start and end spaces ko htaya aur lowercase m convert kraa
    all_titles = movies['title'].str.lower().tolist()  # sbhi titles ko lower case m convert kr k list m store kiya
    best_match, score = process.extractOne(movie_name, all_titles) # tuple (matched_title, score)
    
    if score < 60:  # agar score 60 se kam h to match nhi hoga
        raise HTTPException(status_code=404, detail=f"No close match found for '{movie_name}'") #404 error raise kr rhe h agr movie database m nhi h 
    
    index = movies[movies['title'].str.lower() == best_match].index[0]    # matched title ka index nikal rhe h original dataframe se
    distances = list(enumerate(similarity[index].toarray().flatten()))   # similarity matrix m se us movie k similarity scores nikal rhe h
    movies_list = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]   # top 5 similar movies (excluding itself)
    
    recommendations_df = movies.iloc[[i[0] for i in movies_list]][['title']]
    #recommendations = movies.iloc[[i[0] for i in movies_list]][['title']].to_dict(orient='records')    # recommended movies k titles nikal rhe h dictionary format m
    # hm dictionary m isliye convert kr rhe h taaki json response m easily bhej ske kyuki json key value pair hota h

    # Merging movie details (join by title)
    enriched = pd.merge(
        recommendations_df,
        details[['title', 'genres', 'overview', 'top_3_actors' , 'keywords' , 'director']],
        on='title',
        how='left'
    )

    return {
        "searched_movie": movies.loc[index, 'title'],
        "match_score": score,
        "recommendations": enriched.to_dict(orient='records')
    }