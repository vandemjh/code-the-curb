from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np
import pandas as pd
from typing import List

router = APIRouter()

try:
    with open("model.pkl", "rb") as f:
        model, preprocessor = pickle.load(f)
except FileNotFoundError:
    raise Exception("Model file not found. Ensure model.pkl is in the current directory.")

class ParkingRequest(BaseModel):
    block_id: str
    day: int  # 0-6 for Monday-Sunday

    class Config:
        json_schema_extra = {
            "example": {
                "block_id": "A123",
                "day": 1
            }
        }

def predict_parking_day(block_id: str, day: int) -> List[float]:
    """
    Generate parking predictions for each hour of the specified day.
    """
    categorical_features = ["stall_id"]
    numerical_features = ["time_sin", "time_cos", "day_sin", "day_cos"]
    
    hours = range(24)
    probabilities = []

    for hour in hours:
        time_sin = np.sin(2 * np.pi * hour / 24)
        time_cos = np.cos(2 * np.pi * hour / 24)
        day_sin = np.sin(2 * np.pi * day / 7)
        day_cos = np.cos(2 * np.pi * day / 7)

        data = pd.DataFrame({
            "stall_id": [block_id],
            "time_sin": [time_sin],
            "time_cos": [time_cos],
            "day_sin": [day_sin],
            "day_cos": [day_cos],
        })

        X = data[categorical_features + numerical_features]
        X_processed = preprocessor.transform(X)
        prob = float(model.predict_proba(X_processed)[0][0])
        probabilities.append(prob)

    return probabilities

@router.post("/predict")
async def predict(request: ParkingRequest):
    """
    Get parking predictions for each hour of the specified day.
    Returns probabilities for all 24 hours.
    """
    print(request)
    # Validate day input
    if not 0 <= request.day <= 6:
        raise HTTPException(
            status_code=400,
            detail="Day must be between 0 (Monday) and 6 (Sunday)"
        )
    
    try:
        probabilities = predict_parking_day(request.block_id, request.day)
        return {
            "block_id": request.block_id,
            "day": request.day,
            "hourly_predictions": [
                {
                    "hour": hour,
                    "probability": prob
                }
                for hour, prob in enumerate(probabilities)
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
