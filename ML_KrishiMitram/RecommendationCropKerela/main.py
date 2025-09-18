from fastapi import FastAPI, Query
from pydantic import BaseModel
import pandas as pd
from utils import load_data, recommend_crop, best_crop_for_district

app = FastAPI(title="Crop Recommendation API")

# Load dataset once at startup
DATA_PATH = "dataset.csv"
df = load_data(DATA_PATH)

@app.get("/")
def root():
    return {"message": "Welcome to Crop Recommendation API"}

# ---------------- GET endpoints ----------------

@app.get("/recommend")
def recommend(
    district: str = Query(..., description="District name"),
    crop: str = Query(..., description="Crop name")
):
    """Check if a crop shows positive growth in a district (last 3 years avg %)."""
    rec = recommend_crop(df, district, crop)
    return {"district": district, "crop": crop, "recommendation": rec}

@app.get("/best_crop")
def best_crop(
    district: str = Query(..., description="District name")
):
    """Find the best crop for a district using CAGR (Compound Annual Growth Rate)."""
    rec = best_crop_for_district(df, district)
    return {"district": district, "best_crop": rec}

# ---------------- POST endpoints ----------------

class RecommendationRequest(BaseModel):
    district: str
    crop: str

@app.post("/recommend_json")
def recommend_json(request: RecommendationRequest):
    rec = recommend_crop(df, request.district, request.crop)
    return {
        "district": request.district,
        "crop": request.crop,
        "recommendation": rec
    }

class BestCropRequest(BaseModel):
    district: str

@app.post("/best_crop_json")
def best_crop_json(request: BestCropRequest):
    rec = best_crop_for_district(df, request.district)
    return {
        "district": request.district,
        "best_crop": rec
    }
