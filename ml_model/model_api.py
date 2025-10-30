from fastapi import FastAPI 
import joblib
from scipy import sparse

app = FastAPI()

movies = joblib.load('C:\\Users\\av979\\OneDrive\\Desktop\\Movie-recommender\\TASK-3-movie-recommender\\ml_model\\movies_df.joblib')
similarity = sparse.load_npz('C:\\Users\\av979\\OneDrive\\Desktop\\Movie-recommender\\TASK-3-movie-recommender\\ml_model\\cos_sim_sparse.npz')

@app.get("/")
def home():
    return {"message": "Movie Recommender API running!"}

@app.get("/recommend/{movie_name}")
def recommend(movie_name: str):
    if movie_name not in movies['title'].values:
        return {"error": "Movie not found"}
    index = movies[movies['title'] == movie_name].index[0]
    distances = list(enumerate(similarity[index].toarray().flatten()))
    movies_list = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]
    recommendations = movies.iloc[[i[0] for i in movies_list]]['title'].tolist()
    return {"recommendations": recommendations}