# 🎬 Movie Recommender System  

An **AI-powered Movie Recommendation System** featuring a **dedicated Frontend**, a **complete Backend** (Login/Signup + Profile management), and an **independent ML API** built using **FastAPI** for intelligent movie recommendations.  

This project delivers personalized and filtered movie suggestions using modern web technologies, modular microservices, and content-aware filtering (U, U/A, 18+).  
```
Project link - https://movie-recommender-ssom.vercel.app/
Streamlit link - https://movie-recommender-ml-app.streamlit.app/
ML API link - https://movie-recommender-api-pe1p.onrender.com/
```

---

## 🏗️ Project Structure  
```
📁 Movie-Recommender/
│
├── frontend/ # Frontend Web App (React / JS)
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/ # Full Backend (Auth, Profile, DB)
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── config/
│ └── server.js
│
├── ml_model/ # ML Model
│ ├── model.py
│ ├── cos_sim_sparse.npz
│ ├── movies_df.joblib
│ ├── movies_info.csv
│ └── requirements.txt
│
└── backup-streamlit/ # Optional Streamlit Interface (backup UI)
└── streamlit_app.py
```

---

## ✨ Features  

### 🧠 ML Recommendation Engine (FastAPI)
- Intelligent movie recommendations using **Cosine Similarity**.  
- Filters by **Genre, Actor, Keyword, and Content Rating (U / U/A / 18+)**.  
- Fuzzy search for approximate matches.  
- Runs independently as a **microservice**.  

### 🔐 Backend Functionality
- User **Login / Signup / Profile Management**.  
- Fetches data from ML API and TMDB.  
- Handles authentication, favorites, and user preferences.  

### 🖥️ Frontend
- Responsive **React-based** web interface.  
- Beautiful UI for search, filter, and recommendations.  
- Integrated with backend for real user accounts.  

### 🎞️ TMDB Integration
- Displays **movie posters**, metadata, and trending titles using TMDB API.  

---

## 🧩 Tech Stack  

| Layer | Technologies |
|--------|--------------|
| **Frontend** | React, HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js, MongoDB |
| **ML_MODEL** | FastAPI, Python, Pandas, SciPy, Joblib |
| **Data Modeling** | Cosine Similarity, Content-based Filtering |
| **Backup UI** | Streamlit |

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/amanverma-98/TASK-3-movie-recommender.git
cd TASK-3-movie-recommender

2️⃣ Setup ML_MODEL
cd ml_model
python -m venv venv
venv\Scripts\activate      # Windows
# or
source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
uvicorn ml_model.model_api2:app --reload


Runs at → http://127.0.0.1:8000
Docs → http://127.0.0.1:8000/docs

3️⃣ Setup Backend
cd ../backend
npm install
npm start


Runs at → http://localhost:5000
Handles login, signup, profile, and connects to the ML API.

4️⃣ Setup Frontend
cd ../frontend
npm install
npm start


Runs at → http://localhost:3000
Main user interface for exploring and interacting with movies.

5️⃣ (Optional) Streamlit UI

For local testing of ML API (backup interface):

cd ../backup-streamlit
streamlit run streamlit_app.py

🌐 ML API Endpoints
Endpoint	Method	Description
/	GET	Health Check
/search/{query}	GET	Search movies by title, genre, actor, tag, etc.
/recommend/{movie_name}	GET	Get similar movies to a given one
Filters	Query params: genre, actor, tag, content_rating, filter_priority	

Examples:

/search/inception?genre=Sci-Fi
/recommend/avatar?content_rating=U/A

🎬 Content Rating Classification
Rating	Meaning	Example Genres
U	Universal (All Ages)	Adventure, Comedy, Family
U/A	Parental Guidance	Thriller, Action, War
18+	Adult Content	Violence, Drugs, Erotic
🧠 Architecture
┌────────────┐        ┌─────────────┐        ┌──────────────┐
│  Frontend  │  --->  │   Backend   │  --->  │   ML API     │
│ (React)    │        │ (Node.js)   │        │ (FastAPI)    │
└────────────┘        └─────────────┘        └──────────────┘
       ▲                                            │
       │                                            ▼
       └────────────── TMDB API / Dataset ──────────┘

💡 Future Enhancements

✅ Personalized recommendations per user

✅ Watchlist & Favorites

✅ Sentiment-based movie review analysis

✅ Social features (follow/friends)

✅ Docker & Render / AWS deployment

👨‍💻 Contributors
Name	Role
Aman Verma	ML
Manjiri Sharma ML
Dishant Singh ML
Shreya Singh	Auth, Profile, and API Integration
Akshat Sharma	UI Development & TMDB Integration
🪪 License

Licensed under the MIT License — feel free to use, modify, and distribute.

🧠 Notes

The Streamlit app is included only as a backup UI for testing the ML API.

Production workflow follows → Frontend ↔ Backend ↔ ML API.

Ensure proper .env setup for API keys, database URLs, and secrets before running.
