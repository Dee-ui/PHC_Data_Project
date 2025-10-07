# scripts/generate_medicine_stock_synthetic.py
import os
import numpy as np
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
DATA_ROOT = Path(os.getenv("DATA_ROOT", "./data"))
RAW_DIR = DATA_ROOT / "raw" / "_manual"
VISITS = RAW_DIR / "clinic_visits.csv"
OUT = RAW_DIR / "medicine_stock.csv"

SEED = int(os.getenv("SYNTH_SEED", "42"))
rng = np.random.default_rng(SEED)

# a small essential list; expand if you want
ITEMS = [
    ("ACT", "Artemisinin-based Combination Therapy"),
    ("ORS", "Oral Rehydration Salts"),
    ("AMOX", "Amoxicillin 500mg"),
    ("ZINC", "Zinc 20mg"),
]

# per-visit consumption rates (very rough proxies)
CONSUMPTION_PER_VISIT = {
    "ACT": 0.12,   # malaria share
    "ORS": 0.08,   # diarrheal cases
    "AMOX": 0.06,  # bacterial infections
    "ZINC": 0.05,  # child diarrhea treatment
}

def monthly_target(cons_rate, visits):
    return cons_rate * visits

def main():
    if not VISITS.exists():
        raise FileNotFoundError(f"Missing {VISITS}. Generate clinic_visits first.")
    v = pd.read_csv(VISITS)
    # keep a manageable subset in dev
    # v = v.sample(n=20000, random_state=SEED)

    rows = []
    for item_code, item_name in ITEMS:
        cons_rate = CONSUMPTION_PER_VISIT[item_code]
        tmp = v[["clinic_id","month","total_visits"]].copy()
        tmp["expected_consumption"] = (tmp["total_visits"] * cons_rate)
        # reorder policy: set reorder level near 1.2 × expected
        tmp["reorder_level"] = np.clip((tmp["expected_consumption"]*1.2).round(), 5, None)
        # lead time: ~ 14–45 days
        tmp["lead_time_days"] = rng.integers(14, 46, size=len(tmp))
        # stock on hand: around 1.5 × expected ± noise
        noise = rng.normal(0, tmp["expected_consumption"].clip(5, None)*0.25)
        tmp["stock_on_hand"] = np.clip((tmp["expected_consumption"]*1.5 + noise).round(), 0, None)
        # high risk if below reorder level or < 0.7 × expected
        tmp["is_high_risk_stockout"] = ((tmp["stock_on_hand"] <= tmp["reorder_level"]) | 
                                        (tmp["stock_on_hand"] < (tmp["expected_consumption"]*0.7))).astype(int)
        tmp["item_code"] = item_code
        tmp["item_name"] = item_name
        tmp["source"] = "synthetic_ng_stock_v1"
        rows.append(tmp)

    out = pd.concat(rows, ignore_index=True)
    # reorder columns to match contract
    out = out[[
        "clinic_id", "month", "item_code", "item_name",
        "stock_on_hand", "reorder_level", "lead_time_days",
        "is_high_risk_stockout", "source"
    ]]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(OUT, index=False)
    print(f"✅ Saved {OUT} rows={len(out)} clinics={v['clinic_id'].nunique()} months={v['month'].nunique()} items={len(ITEMS)}")

if __name__ == "__main__":
    main()