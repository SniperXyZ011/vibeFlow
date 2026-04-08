import mlflow
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
import dagshub

# 1. Initialize DagsHub to allow the API to 'see' the remote model
dagshub.init(repo_owner='AryanBaibaswata', repo_name='SonicForecast', mlflow=True)
mlflow.set_tracking_uri("https://dagshub.com/AryanBaibaswata/SonicForecast.mlflow")

app = FastAPI(title="SonicForecast API")

# 2. Define the Input Data Schema
class SongFeatures(BaseModel):
    bpm: int
    danceability_percent: int
    valence_percent: int
    energy_percent: int
    acousticness_percent: int
    instrumentalness_percent: int
    liveness_percent: int
    speechiness_percent: int
    artist_count: int
    released_month: int

# 3. Load the model globally so it's only done once on startup
# REPLACE the string below with your actual Run ID from DagsHub!
LOGGED_MODEL = 'model:/v1/1'
model = mlflow.pyfunc.load_model(LOGGED_MODEL)

@app.get("/")
def home():
    return {"message": "SonicForecast API is Live!"}

@app.post("/predict")
def predict(features: SongFeatures):
    # Convert input to DataFrame for the pipeline
    input_df = pd.DataFrame([{
        'bpm': features.bpm,
        'danceability_%': features.danceability_percent,
        'valence_%': features.valence_percent,
        'energy_%': features.energy_percent,
        'acousticness_%': features.acousticness_percent,
        'instrumentalness_%': features.instrumentalness_percent,
        'liveness_%': features.liveness_percent,
        'speechiness_%': features.speechiness_percent,
        'artist_count': features.artist_count,
        'released_month': features.released_month
    }])
    
    # Make prediction (Log Scale)
    prediction_log = model.predict(input_df)
    
    # Convert back from Log to actual Stream count (exp - 1)
    actual_streams = np.expm1(prediction_log)[0]
    
    return {
        "predicted_streams": round(float(actual_streams), 0)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)