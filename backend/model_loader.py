# backend/model_loader.py
import os, json, pickle, joblib
import numpy as np
import pandas as pd

from typing import List, Optional, Tuple
from sklearn.preprocessing import StandardScaler

try:
    import tensorflow as tf  # needed for Keras models (even when pickled)
    from tensorflow.keras.models import load_model as keras_load_model
except Exception:
    tf = None
    keras_load_model = None

class ModelBundle:
    def __init__(self, model, scaler: Optional[StandardScaler], features: List[str], version: str):
        self.model = model
        self.scaler = scaler
        self.features = features
        self.version = version

def _load_meta(meta_path: str) -> Tuple[List[str], Optional[np.ndarray], Optional[np.ndarray]]:
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
    features = meta.get("features", [])
    mean = np.array(meta["scaler_mean"]) if "scaler_mean" in meta else None
    scale = np.array(meta["scaler_scale"]) if "scaler_scale" in meta else None
    return features, mean, scale

def _reconstruct_scaler(mean: np.ndarray, scale: np.ndarray, n_features: int) -> StandardScaler:
    sc = StandardScaler()
    sc.mean_ = mean
    sc.scale_ = scale
    sc.var_ = scale**2
    sc.n_features_in_ = n_features
    return sc

def load_bundle(
    model_path: str,
    scaler_path: Optional[str] = None,
    meta_path: Optional[str] = None
) -> ModelBundle:
    # Prefer .keras / SavedModel if present
    base, ext = os.path.splitext(model_path)
    keras_candidate = base + ".keras"
    if os.path.exists(keras_candidate) and keras_load_model:
        model = keras_load_model(keras_candidate, compile=False)
        version = "keras_savedmodel"
    else:
        # Fallback to pickle
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        version = f"pickle::{type(model).__name__}"

    scaler = None
    features: List[str] = []

    if scaler_path and os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)

    if meta_path and os.path.exists(meta_path):
        feats, mean, scale = _load_meta(meta_path)
        features = feats or features
        if scaler is None and mean is not None and scale is not None:
            scaler = _reconstruct_scaler(mean, scale, len(features))

    return ModelBundle(model=model, scaler=scaler, features=features, version=version)

def prepare_features(df_in: pd.DataFrame, features: List[str], scaler: Optional[StandardScaler]) -> np.ndarray:
    # Ensure all expected columns exist (fill missing with NaN)
    df = df_in.copy()
    for col in features:
        if col not in df.columns:
            df[col] = np.nan
    # Reorder & restrict
    X = df[features].astype(float).values
    if scaler is not None:
        X = scaler.transform(X)
    return X
