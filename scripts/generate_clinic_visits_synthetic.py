import os, math
import numpy as np
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# --- Config / Inputs ---
DATA_ROOT   = Path(os.getenv("DATA_ROOT", "./data"))
RAW_DIR     = DATA_ROOT / "raw" / "_manual"
FAC_FILE    = RAW_DIR / "clinic_geo_data.csv"              # from HDX/Healthsites (already built)
OUT_FILE    = RAW_DIR / "clinic_visits.csv"               # contract path

START_YEAR  = int(os.getenv("START_YEAR", "2020"))
END_YEAR    = int(os.getenv("END_YEAR", "2024"))

# Controls to keep data manageable during dev
MAX_CLINICS = int(os.getenv("SYNTH_MAX_CLINICS", "600"))   # use small subset first; set large later
SEED        = int(os.getenv("SYNTH_SEED", "42"))

# --- Nigeria-aware simple climate/seasonality (very lightweight) ---
NORTH = {"Borno","Kano","Kaduna","Katsina","Sokoto","Yobe","Zamfara","Jigawa","Bauchi","Gombe","Kebbi","Niger","Kwara","Plateau","Benue","Taraba","Nasarawa","FCT"}
COAST = {"Lagos","Rivers","Bayelsa","Delta","Akwa Ibom","Cross River","Ondo","Ogun","Edo"}
# everyone else treated as "middle"
def seasonal_multiplier(month_num: int) -> float:
    """Base monthly seasonality shared nationwide (flu/rain patterns, holidays)."""
    x = (month_num-1) / 12.0 * 2 * math.pi
    base = 1.0 + 0.12 * math.sin(x)   # +/-12% seasonality
    if month_num in (6,7,8,9): base *= 1.06   # rainy season bump
    if month_num in (12,1):    base *= 0.93   # holiday dip
    return base

def climate_for(state: str, month_num: int, rng: np.random.Generator):
    if state in NORTH:
        rain = max(0, rng.normal(60, 25)) * (1.2 if month_num in (6,7,8,9) else 0.6)
        temp = rng.normal(30, 2)
    elif state in COAST:
        rain = max(0, rng.normal(180, 60)) * (1.3 if month_num in (6,7,8,9) else 0.9)
        temp = rng.normal(27, 1.5)
    else:
        rain = max(0, rng.normal(110, 40)) * (1.2 if month_num in (6,7,8,9) else 0.8)
        temp = rng.normal(28, 1.5)
    return float(round(rain,1)), float(round(temp,1))

def staff_capacity(level: str, rng: np.random.Generator):
    lvl = (level or "").lower()
    if "primary" in lvl:
        docs  = max(0, int(rng.normal(1.2, 0.6)))
        nurs  = max(0, int(rng.normal(4.0, 1.5)))
        beds  = max(1, int(rng.normal(12, 5)))
    elif "hospital" in lvl:
        docs  = max(1, int(rng.normal(6, 2)))
        nurs  = max(3, int(rng.normal(18, 6)))
        beds  = max(10, int(rng.normal(60, 15)))
    else:
        docs  = max(0, int(rng.normal(2, 1)))
        nurs  = max(1, int(rng.normal(8, 3)))
        beds  = max(2, int(rng.normal(20, 7)))
    return docs, nurs, beds

def expected_visits(docs, nurs, beds, month_num, rng: np.random.Generator):
    """Simple visit generator: staff-driven base × seasonality + noise."""
    base = 35 * (1 + docs*0.35 + nurs*0.06) + beds*0.4
    base *= seasonal_multiplier(month_num)
    noise = rng.normal(0, max(5.0, base*0.08))
    return max(0, int(base + noise))

def to_months(start_year, end_year):
    idx = pd.period_range(f"{start_year}-01", f"{end_year}-12", freq="M")
    return [p.to_timestamp() for p in idx]

def main():
    rng = np.random.default_rng(SEED)

    if not FAC_FILE.exists():
        raise FileNotFoundError(f"Missing facility file: {FAC_FILE}")

    fac = pd.read_csv(FAC_FILE)
    # take manageable subset for dev, but deterministic
    if len(fac) > MAX_CLINICS:
        fac = fac.sample(n=MAX_CLINICS, random_state=SEED)

    # ensure required columns exist (fallbacks)
    for col in ["clinic_id","clinic_name","state","lga","level"]:
        if col not in fac.columns: fac[col] = None

    months = to_months(START_YEAR, END_YEAR)
    rows = []

    # static per-clinic staff capacity (can evolve later)
    static_sc = {}
    for _, f in fac.iterrows():
        docs, nurs, beds = staff_capacity(f.get("level",""), rng)
        static_sc[f["clinic_id"]] = (docs, nurs, beds)

    for _, f in fac.iterrows():
        cid   = f["clinic_id"]
        state = f.get("state", "Unknown")
        docs, nurs, beds = static_sc[cid]
        for ts in months:
            m = int(ts.month)
            rain, temp = climate_for(state, m, rng)
            power_days = int(np.clip(rng.normal(24, 4), 0, 30))   # proxy outages
            visits = expected_visits(docs, nurs, beds, m, rng)
            rows.append({
                "clinic_id": cid,
                "month": ts.strftime("%Y-%m"),
                "total_visits": visits,
                "available_doctors": docs,
                "available_nurses": nurs,
                "available_beds": beds,
                "power_availability_days": power_days,
                "rainfall_mm": rain,
                "avg_temperature_c": temp,
                "source": "synthetic_ng_v1"   # clear label for transparency
            })

    out = pd.DataFrame(rows)
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(OUT_FILE, index=False)
    print(f"✅ Saved {OUT_FILE}  rows={len(out)}  clinics={fac.shape[0]}  months={len(months)}")

if __name__ == "__main__":
    main()
