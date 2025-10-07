import os, requests, pandas as pd
from pathlib import Path

COUNTRY = os.getenv("COUNTRY_ISO3", "NGA")
START   = int(os.getenv("START_YEAR", "2015"))
END     = int(os.getenv("END_YEAR", "2024"))

OUT_DIR = Path("data/raw/worldbank")
OUT_DIR.mkdir(parents=True, exist_ok=True)

URL = f"https://api.worldbank.org/v2/country/{COUNTRY}/indicator/SP.POP.TOTL?format=json&per_page=2000"

def main():
    r = requests.get(URL, timeout=60)
    r.raise_for_status()
    data = r.json()
    if not isinstance(data, list) or len(data) < 2:
        raise RuntimeError("Unexpected World Bank response for population")
    rows = []
    for rec in data[1]:
        if rec["value"] is None: 
            continue
        y = int(rec["date"])
        if START <= y <= END:
            rows.append({"country": COUNTRY, "year": y, "population": int(rec["value"])})
    df = pd.DataFrame(rows).sort_values("year")
    out = OUT_DIR / "population_total.csv"
    df.to_csv(out, index=False)
    print(f"✅ Saved: {out}  rows={len(df)}")
    print(df.tail(3))

if __name__ == "__main__":
    main()
