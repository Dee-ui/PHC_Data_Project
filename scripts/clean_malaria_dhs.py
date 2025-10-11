#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Clean & merge Nigeria DHS/MIS malaria datasets (R → Python conversion)
---------------------------------------------------------------------
Replicates teammate's R workflow:
- Reads 2010, 2015, 2021 MIS household-person recode files (.DTA)
- Filters valid malaria test results (hml35 in {0,1})
- Derives survey weights, cluster id, and year
- Harmonizes region codes (REGCODE) and maps to State names
- Produces:
  1) Individual-level tidy CSV (for detailed analysis)
  2) State-year prevalence CSV (for geospatial mapping)

Usage (example):
    python clean_malaria_dhs.py \
        --dta2010 data/raw/NG_2010_MIS/NGPR61DT/NGPR61FL.DTA \
        --dta2015 data/raw/NG_2015_MIS/NGPR71DT/NGPR71FL.DTA \
        --dta2021 data/raw/NG_2021_MIS/NGPR81DT/NGPR81FL.DTA \
        --outdir data/processed

Notes:
- 2010 & 2015 use state code `shstate` directly.
- 2021 uses `hv024`*10 to align with the same REGCODE scale as older years.
- hml35: malaria RDT result (1=positive, 0=negative). We keep only {0,1}.

Author: Emmanuel
"""

import argparse
from pathlib import Path
import pandas as pd
try:
    import pyreadstat  # for .dta
except ImportError as e:
    raise SystemExit("Missing dependency 'pyreadstat'. Install with: pip install pyreadstat") from e


# ------------ Configuration: Nigeria state code mapping (REGCODE → State) ------------
REGCODE_STATE = {
    10: "Sokoto", 20: "Zamfara", 30: "Katsina", 40: "Jigawa", 50: "Yobe", 60: "Borno",
    70: "Adamawa", 80: "Gombe", 90: "Bauchi", 100: "Kano", 110: "Kaduna", 120: "Kebbi",
    130: "Niger", 140: "FCT Abuja", 150: "Nasarawa", 160: "Plateau", 170: "Taraba",
    180: "Benue", 190: "Kogi", 200: "Kwara", 210: "Oyo", 220: "Osun", 230: "Ekiti",
    240: "Ondo", 250: "Edo", 260: "Anambra", 270: "Enugu", 280: "Ebonyi",
    290: "Cross River", 300: "Akwa Ibom", 310: "Abia", 320: "Imo", 330: "Rivers",
    340: "Bayelsa", 350: "Delta", 360: "Lagos", 370: "Ogun"
}


def read_dta(path: Path) -> pd.DataFrame:
    """Read a Stata .dta file into a pandas DataFrame."""
    df, _meta = pyreadstat.read_dta(str(path))
    return df


def clean_year(df: pd.DataFrame, year: int, reg_col: str) -> pd.DataFrame:
    """
    Clean a DHS MIS dataframe to the columns used downstream.
    - Keep only valid hml35 in {0,1}
    - Derive malaria_status, weights, cluster, year, REGCODE
    - Select & rename columns for consistency
    """
    # Keep only rows with malaria test result in {0,1}
    mask = df["hml35"].isin([0, 1])
    df = df.loc[mask].copy()

    # Derived columns
    df["malaria_status"] = df["hml35"].map({1: "Positive", 0: "Negative"})
    df["weights"] = df["hv005"] / 1e6  # DHS standard weight scaling
    df["cluster"] = df["hv001"]
    df["year"] = year

    # REGCODE logic: 2010/2015 use shstate; 2021 uses hv024 * 10
    if reg_col == "hv024":
        df["REGCODE"] = df["hv024"] * 10
    else:
        df["REGCODE"] = df[reg_col]

    # Keep consistent columns
    keep = ["REGCODE", "year", "cluster", "weights", "hv105", "hml35", "malaria_status"]
    out = df[keep].rename(columns={"hv105": "Age", "hml35": "status"})
    # Enforce integer type for REGCODE when possible
    with pd.option_context("mode.chained_assignment", None):
        out["REGCODE"] = pd.to_numeric(out["REGCODE"], errors="coerce").astype("Int64")

    return out


def compute_state_year_prevalence(df_individual: pd.DataFrame) -> pd.DataFrame:
    """
    Given individual-level records with binary status (0/1), compute state-year prevalence.
    """
    # Map state names
    df_individual = df_individual.copy()
    df_individual["State"] = df_individual["REGCODE"].map(REGCODE_STATE)

    # Group and aggregate
    grp = (
        df_individual
        .dropna(subset=["REGCODE"])
        .groupby(["State", "year"], as_index=False)
        .agg(
            REGCODE=("REGCODE", "mean"),   # mean is fine since REGCODE is constant within group
            y=("status", "sum"),           # total positives
            n=("status", "count")          # total tested
        )
    )
    grp["prevalence"] = grp["y"] / grp["n"]
    grp["state_id"] = grp["REGCODE"] / 10.0
    grp = grp[["state_id", "State", "year", "y", "n", "prevalence"]].sort_values(["year", "state_id"]).reset_index(drop=True)
    return grp


def main():
    parser = argparse.ArgumentParser(description="Clean & merge Nigeria DHS MIS malaria datasets.")
    parser.add_argument("--dta2010", required=True, type=Path, help="Path to NGPR61FL.DTA (2010 MIS)")
    parser.add_argument("--dta2015", required=True, type=Path, help="Path to NGPR71FL.DTA (2015 MIS)")
    parser.add_argument("--dta2021", required=True, type=Path, help="Path to NGPR81FL.DTA (2021 MIS)")
    parser.add_argument("--outdir", required=True, type=Path, help="Output directory for CSVs")
    args = parser.parse_args()

    outdir = args.outdir
    outdir.mkdir(parents=True, exist_ok=True)

    # ---- Load raw DTA files ----
    print("[INFO] Reading DTA files...")
    df10 = read_dta(args.dta2010)
    df15 = read_dta(args.dta2015)
    df21 = read_dta(args.dta2021)

    # ---- Clean per year ----
    print("[INFO] Cleaning 2010...")
    d10 = clean_year(df10, 2010, reg_col="shstate")
    print("[INFO] Cleaning 2015...")
    d15 = clean_year(df15, 2015, reg_col="shstate")
    print("[INFO] Cleaning 2021...")
    d21 = clean_year(df21, 2021, reg_col="hv024")

    # ---- Concatenate all years ----
    print("[INFO] Concatenating years...")
    malaria_data = pd.concat([d10, d15, d21], ignore_index=True)

    # ---- Save individual-level tidy data ----
    indiv_out = outdir / "malaria_individual_records.csv"
    malaria_data.to_csv(indiv_out, index=False)
    print(f"[OK] Saved individual-level CSV → {indiv_out}")

    # ---- Compute and save state-year prevalence ----
    print("[INFO] Computing prevalence by state-year...")
    prevalence = compute_state_year_prevalence(malaria_data)

    prev_out = outdir / "malaria_prevalence_state_year.csv"
    prevalence.to_csv(prev_out, index=False)
    print(f"[OK] Saved prevalence CSV → {prev_out}")

    # ---- Quick sanity summary ----
    print("\n=== Quick Summary ===")
    print("Records by year:")
    print(malaria_data.groupby('year').size())
    print("\nPreview of prevalence:")
    print(prevalence.head(10))


if __name__ == "__main__":
    main()