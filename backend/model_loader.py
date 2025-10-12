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

def project_to_canonical(df_raw: pd.DataFrame) -> pd.DataFrame:
    """
    Map year-suffixed raw columns to canonical 22 features expected by the model_meta.
    Customize the strategy as needed (by year, latest, rolling, etc.).
    """
    df = pd.DataFrame(index=df_raw.index)

    # Example: pick “latest” year present from a fixed set
    YEARS = [2020, 2015, 2010, 2005, 2000]
    def pick_latest(prefix):
        for y in YEARS:
            col = f"{prefix}_{y}"
            if col in df_raw.columns:
                return df_raw[col]
        return np.nan  # will be filled later

    df["All_Population_Count"]   = pick_latest("All_Population_Count")
    df["Aridity"]                = pick_latest("Aridity")
    df["Day_Land_Surface_Temp"]  = pick_latest("Day_Land_Surface_Temp")
    df["Diurnal_Temperature_Range"] = pick_latest("Diurnal_Temperature_Range")
    df["Enhanced_Vegetation_Index"] = pick_latest("Enhanced_Vegetation_Index")
    df["Frost_Days"]             = pick_latest("Frost_Days")
    df["ITN_Coverage"]           = pick_latest("ITN_Coverage")
    df["Land_Surface_Temperature"] = pick_latest("Land_Surface_Temperature")
    df["Malaria_Incidence"]      = pick_latest("Malaria_Incidence")
    df["Maximum_Temperature"]    = pick_latest("Maximum_Temperature")
    df["Mean_Temperature"]       = pick_latest("Mean_Temperature")
    df["Minimum_Temperature"]    = pick_latest("Minimum_Temperature")
    df["Night_Land_Surface_Temp"] = pick_latest("Night_Land_Surface_Temp")
    df["PET"]                    = pick_latest("PET")
    df["Precipitation"]          = pick_latest("Precipitation")
    df["Rainfall"]               = pick_latest("Rainfall")
    df["U5_Population"]          = pick_latest("U5_Population")
    df["UN_Population_Count"]    = pick_latest("UN_Population_Count")
    df["UN_Population_Density"]  = pick_latest("UN_Population_Density")
    df["Wet_Days"]               = pick_latest("Wet_Days")

    # You still need to supply these two from history (can’t infer from one row)
    if "prev_lag1" in df_raw.columns: df["prev_lag1"] = df_raw["prev_lag1"]
    else: df["prev_lag1"] = np.nan
    if "prev_roll3" in df_raw.columns: df["prev_roll3"] = df_raw["prev_roll3"]
    else: df["prev_roll3"] = np.nan

    return df


def prepare_features(df_in: pd.DataFrame, features: List[str], scaler: Optional[StandardScaler]) -> np.ndarray:
    df = df_in.copy()

    # Ensure every expected column exists
    for col in features:
        if col not in df.columns:
            df[col] = np.nan

    # Strictly keep only expected columns and coerce to numeric
    df = df[features].apply(pd.to_numeric, errors="coerce")

    # Fill any missing with 0.0 (safer for inference when scaler is absent)
    df = df.fillna(0.0)

    X = df.values
    if scaler is not None:
        X = scaler.transform(X)
    return X
