import json
import pandas as pd
from pathlib import Path

INPUT = Path("data/raw/_manual/nigeriahealthfacilities.json")
OUTPUT = Path("data/raw/_manual/clinic_geo_data.csv")

def main():
    with open(INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    records = []
    for feat in data.get("features", []):
        props = (feat.get("properties") or {})
        geom = feat.get("geometry") or {}
        coords = geom.get("coordinates") or [None, None]
        lon, lat = (coords[0], coords[1]) if len(coords) >= 2 else (None, None)

        # Raw fields from source
        fid = props.get("id")                      # integer-ish id from source
        name = props.get("name")
        state_name = props.get("state_name")
        state_code = props.get("state_code")
        lga_name = props.get("lga_name")
        lga_code = props.get("lga_code")
        ward_code = props.get("ward_code")
        functional_status = props.get("functional_status")  # we'll store as 'ownership'
        level_type = props.get("type")                      # Primary / Secondary / ...
        category = props.get("category")                    # "Primary Health Center"
        ts = props.get("timestamp")                         # ISO string

        # Derived & standardized
        clinic_id = f"NGA-{str(fid).zfill(6)}" if fid is not None else None
        year_recorded = None
        if ts:
            try:
                year_recorded = int(ts[:4])
            except Exception:
                year_recorded = None

        records.append({
            "clinic_id": clinic_id,
            "clinic_name": name,
            "latitude": lat,
            "longitude": lon,
            "state": state_name,
            "state_code": state_code,
            "lga": lga_name,
            "lga_code": lga_code,
            "ward_code": str(ward_code) if ward_code is not None else None,
            "ownership": functional_status,
            "level": level_type,
            "category": category,
            "timestamp": ts,
            "year_recorded": year_recorded,
            "source": "HDX Nigeria Health Facilities (GeoJSON)"
        })

    df = pd.DataFrame.from_records(records)

    # Basic cleansing
    df = df.dropna(subset=["clinic_id", "latitude", "longitude"])
    df = df.drop_duplicates(subset=["clinic_id"])

    # Type coercions
    numeric_cols = ["latitude", "longitude"]
    for c in numeric_cols:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    # Save
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT, index=False)
    print(f"✅ Saved: {OUTPUT}  rows={len(df)}")
    print(df.head(3))

if __name__ == "__main__":
    main()
