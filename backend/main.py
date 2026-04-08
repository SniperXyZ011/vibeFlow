from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import math

app = FastAPI(title="SonicForecast API")

# Setup CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (can be restricted to localhost:5173 later)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model pipeline
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model.pkl')
try:
    model_pipeline = joblib.load(model_path)
    print(f"Model loaded successfully from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}. Make sure to run export_model.py first.")
    model_pipeline = None

# Input Data Schema
class TrackFeatures(BaseModel):
    bpm: float
    danceability__: float
    valence__: float
    energy__: float
    acousticness__: float
    instrumentalness__: float
    liveness__: float
    speechiness__: float
    artist_count: int
    released_month: int

    class Config:
        # Pydantic alias generator to handle properties with `%` sign
        # Frontend might send properties mapped differently, so let's allow flexibility.
        # However, the frontend sends danceability_% or danceability__? Let's alias it carefully.
        pass

# The frontend actually sends the data like: {'bpm': 120, 'danceability_%': 80, ...}
# Since python variables can't have '%', we will just accept a generic dict
# or strongly type it with schema mapping
from pydantic import Field

class PydanticTrackFeatures(BaseModel):
    bpm: float = Field(..., alias="bpm")
    danceability_pct: float = Field(..., alias="danceability_%")
    valence_pct: float = Field(..., alias="valence_%")
    energy_pct: float = Field(..., alias="energy_%")
    acousticness_pct: float = Field(..., alias="acousticness_%")
    instrumentalness_pct: float = Field(..., alias="instrumentalness_%")
    liveness_pct: float = Field(..., alias="liveness_%")
    speechiness_pct: float = Field(..., alias="speechiness_%")
    artist_count: int = Field(..., alias="artist_count")
    released_month: int = Field(..., alias="released_month")

@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model_pipeline is not None}

@app.post("/predict")
def predict_hit(features: PydanticTrackFeatures):
    if not model_pipeline:
        return {"error": "Model not loaded on the backend."}
    
    # Convert incoming dict into the format pandas expects
    # The aliases perfectly map back to what the scikit pipeline expects
    input_data = {
        'bpm': [features.bpm],
        'danceability_%': [features.danceability_pct],
        'valence_%': [features.valence_pct],
        'energy_%': [features.energy_pct],
        'acousticness_%': [features.acousticness_pct],
        'instrumentalness_%': [features.instrumentalness_pct],
        'liveness_%': [features.liveness_pct],
        'speechiness_%': [features.speechiness_pct],
        'artist_count': [features.artist_count],
        'released_month': [features.released_month]
    }
    
    df = pd.DataFrame(input_data)
    
    # Predict the log of streams
    log_streams = model_pipeline.predict(df)[0]
    
    # Normalizing the score
    # log_streams usually caps around 22.5 max for ~3B streams
    # So we'll map that linearly or semi-linearly to 0-100
    max_expected_log = 22.5
    raw_score = (log_streams / max_expected_log) * 100
    
    # Clamp score to 0 - 100
    score = max(0, min(100, raw_score))
    
    return {"prediction": float(score), "log_streams_raw": float(log_streams)}
