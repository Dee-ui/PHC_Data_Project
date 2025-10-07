import os, requests, pandas as pd
from pathlib import Path

COUNTRY = os.getenv("COUNTRY_ISO3", "NGA")
START   = int(os.getenv("START_YEAR", "2015"))
END     = int(os.getenv("END_YEAR", "2024"))

OUT_DIR = Path("data/raw/worldbank")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Primary correct code (Outpatient visits per capita), plus fallback
INDICATOR_CODES = ["SH.VST.OUTP", "SH.MED.OUTP.ZS"]

def fetch_indicator(country: str, code: str) -> pd.DataFrame:
    url = f"https://api.worldbank.org/v2/country/{country}/indicator/{code}?format=json&per_page=20000"
    r = requests.get(url, timeout=60)
    r.raise_for_status()
    data = r.json()
    # Expect [metadata, rows]; rows can be None/[] for sparse series
    if not isinstance(data, list) or len(data) < 2 or not data[1]:
        return pd.DataFrame()
    rows = []
    for rec in data[1]:
        val = rec.get("value")
        date = rec.get("date")
        if val is None or date is None:
            continue
        try:
            y = int(date)
        except:
            continue
        if START <= y <= END:
            rows.append({
                "country": rec["country"]["id"],
                "year": y,
                "outpatient_visits_per_capita": float(val)
            })
    return pd.DataFrame(rows)

def main():
    last_debug = None
    for code in INDICATOR_CODES:
        try:
            df = fetch_indicator(COUNTRY, code)
            if not df.empty:
                df = df.sort_values("year")
                out_path = OUT_DIR / "outpatient_visits_per_capita.csv"
                df.to_csv(out_path, index=False)
                print(f"✅ Saved: {out_path} ({len(df)} rows) using indicator {code}")
                print(df.tail(3))
                return
            else:
                print(f"⚠️ No rows for indicator {code} in {START}-{END}. Trying next…")
        except Exception as e:
            last_debug = str(e)
            print(f"⚠️ Error while fetching {code}: {e}. Trying next…")

    raise RuntimeError(
        "No data returned for outpatient visits per capita. "
        "Try manual CSV export from WDI DataBank for indicator SH.VST.OUTP "
        "and save as data/raw/worldbank/outpatient_visits_per_capita.csv "
        f"(last error: {last_debug})"
    )

if __name__ == "__main__":
    main()
