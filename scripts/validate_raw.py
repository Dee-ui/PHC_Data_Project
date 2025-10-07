import yaml
import pandas as pd
from pathlib import Path

# Path to your data contract
CONTRACT = Path("data/contracts/required_files.yml")

def load_contract():
    """Load the YAML file that defines expected CSVs and columns."""
    with open(CONTRACT, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def check_csv(path, expected_cols):
    """Read CSV and verify required columns exist."""
    df = pd.read_csv(path)
    missing = [c for c in expected_cols if c not in df.columns]
    return df, missing

def validate():
    spec = load_contract()
    failures = 0

    for key, meta in spec["required"].items():
        p = Path(meta["path"])
        cols = []
        for col in meta["columns"]:
            if isinstance(col, dict):
                cols.append(list(col.keys())[0])
            else:
                cols.append(col.split(":")[0].strip())
        if not p.exists():
            print(f"[MISSING] {key} → {p}")
            failures += 1
            continue
        try:
            df, missing = check_csv(p, cols)
            if missing:
                print(f"[INVALID] {key}: missing {missing}")
                failures += 1
            else:
                print(f"[OK] {key}: {len(df)} rows ✅")
        except Exception as e:
            print(f"[ERROR] {key}: {e}")
            failures += 1

    if failures:
        print(f"\nValidation failed for {failures} file(s).")
    else:
        print("\nAll required raw files passed validation ✅")

if __name__ == "__main__":
    validate()
