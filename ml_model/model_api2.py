from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import joblib
from scipy import sparse
from fuzzywuzzy import process
import os
import pandas as pd
import re

app = FastAPI(title="Movie Recommender API", version="6.1")  # updated version

BASE_DIR = os.path.dirname(__file__)

# hmne CORS middleware add krdi hai jo frontend se requests allow krta hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# required files ko load kr rhe h
movies = joblib.load(os.path.join(BASE_DIR, "movies_df.joblib"))
details = pd.read_csv(os.path.join(BASE_DIR, "movies_info.csv"))
similarity = sparse.load_npz(os.path.join(BASE_DIR, "cos_sim_sparse.npz"))

# genre , keywords , overview ko mila kr content rating k liye function bna rhe h
def assign_content_rating(row):
    text = f"{row.get('genres', '')} {row.get('keywords', '')} {row.get('overview', '')}".lower()
    text = re.sub(r"[^a-z\s]", " ", text)  # special characters remove kr rhe h

    #Adult / 18+ content indicators
    adult_indicators = [
        "sex", "sexual", "nude", "nudity", "porn", "pornography", "strip", "erotic",
        "intimate", "rape", "explicit", "adult", "violence", "blood", "murder",
        "kill", "drugs", "drug use", "abuse", "affair", "lust"
    ]

    #U/A content indicators
    ua_indicators = [
        "romance", "crime", "thriller", "horror", "fight", "dark", "intense", "war",
        "fantasy", "supernatural", "revenge"
    ]

    adult_score = sum(1 for w in adult_indicators if re.search(rf"\b{w}\b", text))
    ua_score = sum(1 for w in ua_indicators if re.search(rf"\b{w}\b", text))

    if adult_score >= 1:
        return "18+"
    elif ua_score >= 1:
        return "U/A"
    else:
        return "U"

# content rating ka column details me add kr rhe h
details["content_rating"] = details.apply(assign_content_rating, axis=1)
print(details["content_rating"].unique())
# helper function to keep only top 3 actors
def keep_top_3_actors(x):
    actors = str(x).split(",")  # split by comma
    top_3 = actors[:3]          # take only first 3
    return ", ".join([a.strip() for a in top_3])  # join back as string

@app.get("/")
def home():
    return {"message": "🎬 Movie Recommender API with Filters, Smart Ratings & Popularity Sorting is Running!"}


#Search endpoint
@app.get("/search/{query}")
def search_movies(
    query: str,   #mandatory parameter
    genre: str | None = Query(None), #optional parameters
    actor: str | None = Query(None),
    tag: str | None = Query(None),
    content_rating: str | None = Query(None),
    filter_priority: str | None = Query(None, description="Choose: genre, actor, tag, rating")
):
    query = query.strip().lower()
    all_titles = movies["title"].fillna("").astype(str).str.lower().tolist()

    try:
        results = process.extract(query, all_titles, limit=10)
        matched_indices = [
            i
            for (match, score) in results
            for i in movies[movies["title"].str.lower() == match].index
        ]
        matched_df = movies.iloc[matched_indices][["title"]]
        enriched = pd.merge(
            matched_df,
            details[["title", "genres", "overview", "top_3_actors", "keywords", "director", "content_rating", "popularity"]],
            on="title",
            how="left",
        )

        enriched["match_score"] = [
            score for (match, score) in results for i in movies[movies["title"].str.lower() == match].index
        ]

        # priority k hisab se filters apply kr rhe h
        filters = {"genre": genre, "actor": actor, "tag": tag, "rating": content_rating}
        filters = {k: v for k, v in filters.items() if v}

        # Apply one by one (priority first)
        if filter_priority and filter_priority in filters:
            filters = {filter_priority: filters.pop(filter_priority), **filters}

        for key, val in filters.items():
            if key == "genre":
                enriched = enriched[enriched["genres"].str.contains(val, case=False, na=False)]
            elif key == "actor":
                enriched = enriched[enriched["top_3_actors"].str.contains(val, case=False, na=False)]
            elif key == "tag":
                enriched = enriched[enriched["keywords"].str.contains(val, case=False, na=False)]
            elif key == "rating":
                pattern = re.escape(val)
                enriched = enriched[enriched["content_rating"].str.contains(pattern, case=False, na=False)]


        enriched = enriched.drop_duplicates(subset=["title"])

        # limit top 3 actors
        enriched["top_3_actors"] = enriched["top_3_actors"].apply(keep_top_3_actors)

        #Sort by popularity descending
        enriched = enriched.sort_values(by="popularity", ascending=False)

        return {"results": enriched.to_dict(orient="records")}

    except Exception as e:
        return {"error": f"Search failed: {str(e)}"}


# Recommend Endpoint
@app.get("/recommend/{movie_name}")
def recommend(
    movie_name: str,
    genre: str | None = Query(None),
    actor: str | None = Query(None),
    tag: str | None = Query(None),
    content_rating: str | None = Query(None),
    filter_priority: str | None = Query(None)
):
    movie_name = movie_name.strip().lower()
    all_titles = movies["title"].str.lower().tolist()
    best_match, score = process.extractOne(movie_name, all_titles)

    if score < 60:
        raise HTTPException(status_code=404, detail=f"No close match found for '{movie_name}'")

    index = movies[movies["title"].str.lower() == best_match].index[0]
    distances = list(enumerate(similarity[index].toarray().flatten()))
    movies_list = sorted(distances, reverse=True, key=lambda x: x[1])[1:6]

    recommendations_df = movies.iloc[[i[0] for i in movies_list]][["title"]]
    enriched = pd.merge(
        recommendations_df,
        details[["title", "genres", "overview", "top_3_actors", "keywords", "director", "content_rating", "popularity"]],
        on="title",
        how="left",
    )

    filters = {"genre": genre, "actor": actor, "tag": tag, "rating": content_rating}
    filters = {k: v for k, v in filters.items() if v}

    if filter_priority and filter_priority in filters:
        filters = {filter_priority: filters.pop(filter_priority), **filters}

    for key, val in filters.items():
        if key == "genre":
            enriched = enriched[enriched["genres"].str.contains(val, case=False, na=False)]
        elif key == "actor":
            enriched = enriched[enriched["top_3_actors"].str.contains(val, case=False, na=False)]
        elif key == "tag":
            enriched = enriched[enriched["keywords"].str.contains(val, case=False, na=False)]
        elif key == "rating":
            pattern = re.escape(val)
            enriched = enriched[enriched["content_rating"].str.contains(pattern, case=False, na=False)]

            

    enriched = enriched.drop_duplicates(subset=["title"])

    # limit top 3 actors
    enriched["top_3_actors"] = enriched["top_3_actors"].apply(keep_top_3_actors)

    #Sort recommendations by popularity descending
    enriched = enriched.sort_values(by="popularity", ascending=False)

    return {
        "searched_movie": movies.loc[index, "title"],
        "match_score": score,
        "recommendations": enriched.to_dict(orient="records"),
    }
