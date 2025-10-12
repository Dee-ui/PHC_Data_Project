# backend/routers/predict.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import os, pandas as pd, numpy as np

from . import settings
from backend.model_loader import load_bundle, prepare_features

router = APIRouter(prefix="/api/v1", tags=["predict"])

# Load on import (process start)
MODEL_PATH = os.getenv("MODEL_PATH", "docs/malaria_mlp_model.pkl")
SCALER_PATH = os.getenv("SCALER_PATH", "backend/models/scaler_site_year.joblib")   # optional
META_PATH   = os.getenv("MODEL_META_PATH", "backend/models/model_meta.json")       # optional

BUNDLE = load_bundle(MODEL_PATH, SCALER_PATH, META_PATH)

class PredictRequest(BaseModel):
    records: List[Dict[str, Any]]

class PredictResponse(BaseModel):
    preds: List[float]
    model_version: str
    n_features: int
    used_scaler: bool

@router.get("/model_meta")
def model_meta():
    return {
        "model_version": BUNDLE.version,
        "features": BUNDLE.features or None,
        "uses_scaler": BUNDLE.scaler is not None
    }

@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if BUNDLE.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    if not BUNDLE.features:
        raise HTTPException(
            status_code=500,
            detail="Model features are undefined. Ensure MODEL_META_PATH points to a JSON with a 'features' list."
        )

    df = pd.DataFrame(payload.records)
    try:
        X = prepare_features(df, BUNDLE.features, BUNDLE.scaler)
        yhat = BUNDLE.model.predict(X, verbose=0)
        yhat = np.asarray(yhat).reshape(-1).astype(float).tolist()
    except Exception as e:
        # Return the actual error so you see it in the client while testing
        raise HTTPException(status_code=400, detail=f"Inference error: {e}")
    
    THRESHOLD = float(os.getenv("MODEL_THRESHOLD", "0.5"))
    labels = [1 if p >= THRESHOLD else 0 for p in yhat]

    return PredictResponse(
        preds=yhat,
        labels=labels,
        threshold=THRESHOLD,
        model_version=BUNDLE.version,
        n_features=len(BUNDLE.features),
        used_scaler=BUNDLE.scaler is not None
    )
