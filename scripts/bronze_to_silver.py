# scripts/bronze_to_silver.py
import os
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
DATA_ROOT = Path(os.getenv("DATA_ROOT", "./data"))
RAW_DIR = DATA_ROOT / "raw" / "_manual"
SILVER_DIR = DATA_ROOT / "processed" / "silver"
SILVER_DIR.mkdir(parents=True, exist_ok=True)

def to_month(v):
    try:
        return pd.to_datetime(v).to_period("M").to_timestamp()
    except Exception:
        return pd.NaT

def save_silver(name, df):
    out = SILVER_DIR / f"{name}.csv"
    df.to_csv(out, index=False)
    print(f"[SILVER] wrote {out} ({len(df)} rows)")

def process_clinic_visits():
    f = RAW_DIR / "clinic_visits.csv"
    if not f.exists(): return
    df = pd.read_csv(f)
    if "month" in df.columns:
        df["month"] = df["month"].apply(to_month)
    save_silver("clinic_visits", df)

def process_medicine_stock():
    f = RAW_DIR / "medicine_stock.csv"
    if not f.exists(): return
    df = pd.read_csv(f)
    if "month" in df.columns:
        df["month"] = df["month"].apply(to_month)
    save_silver("medicine_stock", df)

def process_symptom_triage():
    f = RAW_DIR / "symptom_triage.csv"
    if not f.exists(): return
    df = pd.read_csv(f)
    # normalize date column if present
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce").dt.date
    save_silver("symptom_triage", df)

def process_clinic_geo():
    f = RAW_DIR / "clinic_geo_data.csv"
    if not f.exists(): return
    df = pd.read_csv(f)
    save_silver("clinic_geo_data", df)

if __name__ == "__main__":
    process_clinic_geo()
    process_clinic_visits()
    process_medicine_stock()
    process_symptom_triage()