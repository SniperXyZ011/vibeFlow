from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
import os
import dagshub
import mlflow

# 1. Initialize DagsHub & MLflow (Cloud Tracking)
# This allows the API to pull the model artifact directly from the cloud

token = os.getenv("DAGSHUB_TOKEN", "").strip()
if token:
    os.environ["DAGSHUB_TOKEN"] = token
    os.environ["MLFLOW_TRACKING_USERNAME"] = "AryanBaibaswata"
    os.environ["MLFLOW_TRACKING_PASSWORD"] = token

dagshub.init(repo_owner='AryanBaibaswata', repo_name='SonicForecast', mlflow=True)
mlflow.set_tracking_uri("https://dagshub.com/AryanBaibaswata/SonicForecast.mlflow")

app = FastAPI(title="SonicForecast API - Cloud Powered")

# 2. Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Dynamic Model Loading
# REPLACE THIS RUN ID with the one from your DagsHub Experiment page
# RUN_ID = "675dcdf4f2c04273a252fc5fbc807752" 
LOGGED_MODEL = f'models:/v1/1'

try:
    print(f"Fetching model from DagsHub: {LOGGED_MODEL}...")
    model_pipeline = mlflow.pyfunc.load_model(LOGGED_MODEL)
    print("Cloud model loaded successfully!")
except Exception as e:
    print(f"Error loading model from DagsHub: {e}")
    model_pipeline = None

# 4. Input Data Schema (Using Aliases to match Frontend % signs)
class PydanticTrackFeatures(BaseModel):
    bpm: int = Field(..., alias="bpm")
    danceability_pct: int = Field(..., alias="danceability_%")
    valence_pct: int = Field(..., alias="valence_%")
    energy_pct: int = Field(..., alias="energy_%")
    acousticness_pct: int = Field(..., alias="acousticness_%")
    instrumentalness_pct: int = Field(..., alias="instrumentalness_%")
    liveness_pct: int = Field(..., alias="liveness_%")
    speechiness_pct: int = Field(..., alias="speechiness_%")
    artist_count: int = Field(..., alias="artist_count")
    released_month: int = Field(..., alias="released_month")

    class Config:
        populate_by_name = True

@app.get("/health")
async def health_check():  # <-- Add 'async' here
    return {
        "status": "ok", 
        "model_source": "DagsHub/MLflow",
        "model_loaded": model_pipeline is not None
    }

@app.post("/predict")
def predict_hit(features: PydanticTrackFeatures):
    if not model_pipeline:
        raise HTTPException(status_code=503, detail="Model not loaded on the backend.")
    
    # Format data for the scikit-learn pipeline
    # The keys here must match exactly the column names used during training
    input_data = pd.DataFrame([{
        'bpm': features.bpm,
        'danceability_%': features.danceability_pct,
        'valence_%': features.valence_pct,
        'energy_%': features.energy_pct,
        'acousticness_%': features.acousticness_pct,
        'instrumentalness_%': features.instrumentalness_pct,
        'liveness_%': features.liveness_pct,
        'speechiness_%': features.speechiness_pct,
        'artist_count': features.artist_count,
        'released_month': features.released_month
    }])
    
    # 1. Predict the log of streams
    log_prediction = model_pipeline.predict(input_data)[0]
    
    # 2. Convert back to actual stream count (Inverse of log1p is expm1)
    actual_streams = np.expm1(log_prediction)
    
    # 3. Calculate a 0-100 "Hit Score" for the frontend
    # Based on the dataset, ~3B streams is roughly 22 on the log scale
    max_expected_log = 22.5
    raw_score = (log_prediction / max_expected_log) * 100
    clamped_score = max(0, min(100, raw_score))
    
    return {
        "prediction_score": round(float(clamped_score), 2),
        "estimated_streams": round(float(actual_streams), 0),
        "log_raw": float(log_prediction)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)