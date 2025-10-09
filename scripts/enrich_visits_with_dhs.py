import os
import math
import warnings
import numpy as np
import pandas as pd
from pathlib import Path

# Optional: geopandas for shapefile; script still runs without it
try:
    import geopandas as gpd  # only used if shapefile present
    HAS_GPD = True
except Exception:
    HAS_GPD = False

DATA_ROOT = Path(os.getenv("DATA_ROOT", "./data"))
RAW      = DATA_ROOT / "raw"
MANUAL   = RAW / "_manual"
DHS_DIR  = RAW / "dhs"

CLINICS = MANUAL / "clinic_geo_data.csv"      # you already have this
VISITS  = MANUAL / "clinic_visits.csv"        # synthetic baseline
DHS_ENV = DHS_DIR / "dhs_env.csv"             # the file you pasted
DHS_GPS_CSV = DHS_DIR / "dhs_clusters_gps.csv"
DHS_SHAPE   = DHS_DIR / "NGGE81FL.shp"        # optional shapefile

OUT_VISITS = MANUAL / "clinic_visits.csv"     # overwrite in-place
DIFF_LOG   = MANUAL / "clinic_visits_dhs_diff_sample.csv"

# ---------- helpers ----------
def minmax(s):
    s = pd.to_numeric(s, errors="coerce")
    if s.notna().sum() == 0:
        return pd.Series(np.zeros(len(s)), index=s.index)
    lo, hi = s.min(), s.max()
    if pd.isna(lo) or pd.isna(hi) or lo == hi:
        return pd.Series(np.zeros(len(s)), index=s.index)
    return (s - lo) / (hi - lo)

def inv_minmax(s):
    x = minmax(s)
    return 1 - x

def haversine(lat1, lon1, lat2, lon2):
    # inputs in degrees -> distance in km
    R = 6371.0
    p1 = np.radians(lat1); p2 = np.radians(lat2)
    dlat = p2[:,None] - p1[None,:]
    dlon = np.radians(lon2)[:,None] - np.radians(lon1)[None,:]
    a = np.sin(dlat/2.0)**2 + np.cos(p1)[None,:]*np.cos(p2)[:,None]*(np.sin(dlon/2.0)**2)
    c = 2*np.arcsin(np.sqrt(a))
    return R * c  # matrix (clusters x clinics)

def nearest_cluster(clin_df, clu_df, max_km=25_000):
    """
    Map each clinic to nearest cluster by geodesic distance.
    Returns Series aligned to clin_df.index with cluster DHSID (or NaN if none).
    """
    lat_c = clin_df["latitude"].values.astype(float)
    lon_c = clin_df["longitude"].values.astype(float)
    lat_k = clu_df["lat"].values.astype(float)
    lon_k = clu_df["lon"].values.astype(float)

    # process in chunks to limit memory
    chunk = 2000
    nearest_ids = []
    for start in range(0, len(lat_c), chunk):
        end = min(start+chunk, len(lat_c))
        d = haversine(lat_c[start:end], lon_c[start:end], lat_k, lon_k).T  # (clin_chunk x clusters)
        idx_min = d.argmin(axis=1)
        dist_min = d[np.arange(d.shape[0]), idx_min]
        ids = clu_df["DHSID"].values[idx_min]
        ids = pd.Series(ids, index=clin_df.index[start:end])
        ids[dist_min > max_km] = np.nan  # (shouldn't happen with 25,000km safety)
        nearest_ids.append(ids)
    return pd.concat(nearest_ids)

def build_need_index(env):
    """
    Combine key DHS features into a 0..1 'need_index'.
    Higher = more need / expected utilisation.
    You can tweak weights below.
    """
    # Choose one year snapshot (or average); use 2020 where available
    pop  = env.get("All_Population_Count_2020", pd.Series(dtype=float))
    malI = env.get("Malaria_Incidence_2020", pd.Series(dtype=float))
    malP = env.get("Malaria_Prevalence_2020", pd.Series(dtype=float))
    travel = env.get("Travel_Times", pd.Series(dtype=float))
    night  = env.get("Nightlights_Composite", pd.Series(dtype=float))

    # Normalize each (min-max). For nightlights we invert (darker = poorer access).
    f_pop   = minmax(pop)
    f_malI  = minmax(malI)
    f_malP  = minmax(malP)
    f_trvl  = minmax(travel)
    f_dark  = inv_minmax(night)

    # Weights (edit as you like; must sum to 1 for interpretability, but not required)
    w_pop, w_malI, w_malP, w_trvl, w_dark = 0.35, 0.20, 0.15, 0.20, 0.10
    need = (w_pop*f_pop + w_malI*f_malI + w_malP*f_malP + w_trvl*f_trvl + w_dark*f_dark)
    # guard: if all NaN -> set to 1
    if need.notna().sum() == 0:
        need = pd.Series(np.ones(len(env)), index=env.index)
    # avoid zeros (for division later)
    need = need.fillna(need.median())
    need = need.replace(0, need[need>0].min())
    return need

def rescale_within_month(df, weight_col="need_weight"):
    """
    For each month, preserve the total visits but redistribute by weights.
    new_visits = total_month_visits * weight_i / sum(weights)
    """
    out = []
    for m, g in df.groupby("month", sort=False):
        tot = g["total_visits"].sum()
        w = g[weight_col].clip(lower=1e-6)
        g2 = g.copy()
        g2["total_visits"] = (tot * (w / w.sum())).round().astype(int)
        out.append(g2)
    return pd.concat(out, ignore_index=True)

# ---------- main ----------
def main():
    if not VISITS.exists() or not CLINICS.exists() or not DHS_ENV.exists():
        raise FileNotFoundError("Missing one of required files: clinic_visits.csv, clinic_geo_data.csv, dhs_env.csv")

    visits = pd.read_csv(VISITS)
    clinics = pd.read_csv(CLINICS)
    env = pd.read_csv(DHS_ENV)

    # Ensure month is treated as a string YYYY-MM (keep as-is for grouping)
    if "month" in visits.columns:
        visits["month"] = visits["month"].astype(str)

    # 1) Build cluster-level need index from DHS env table
    # Expect key = DHSID present in your env CSV
    if "DHSID" not in env.columns:
        raise KeyError("DHS env file must contain a 'DHSID' column.")
    env = env.drop_duplicates(subset=["DHSID"]).reset_index(drop=True)
    env["need_index"] = build_need_index(env)

    # 2) Load cluster coordinates if available
    clu = None
    if DHS_GPS_CSV.exists():
        gps = pd.read_csv(DHS_GPS_CSV)
        # common DHS columns for lat/lon
        lat_col = next((c for c in gps.columns if c.lower() in ["lat", "latitude", "latnum"]), None)
        lon_col = next((c for c in gps.columns if c.lower() in ["lon", "longitude", "longnum", "lonnum"]), None)
        if lat_col and lon_col and "DHSID" in gps.columns:
            clu = gps[["DHSID", lat_col, lon_col]].rename(columns={lat_col:"lat", lon_col:"lon"})
    elif DHS_SHAPE.exists() and HAS_GPD:
        g = gpd.read_file(DHS_SHAPE)
        if "DHSID" in g.columns:
            clu = pd.DataFrame({"DHSID": g["DHSID"], "lat": g.geometry.y, "lon": g.geometry.x})
    else:
        warnings.warn("No DHS GPS provided; applying national (non-spatial) redistribution.")

    if clu is not None:
        # 3) Map clinics -> nearest DHS cluster (km)
        # guard: ensure clinic lat/lon exist
        for c in ["latitude","longitude"]:
            if c not in clinics.columns:
                raise KeyError(f"clinic_geo_data.csv missing '{c}' column.")
        clinics = clinics.dropna(subset=["latitude","longitude"]).copy()
        clinics["latitude"] = pd.to_numeric(clinics["latitude"], errors="coerce")
        clinics["longitude"] = pd.to_numeric(clinics["longitude"], errors="coerce")
        clinics = clinics.dropna(subset=["latitude","longitude"])

        # keep only clusters that exist in env (to get need_index)
        clu = clu[clu["DHSID"].isin(env["DHSID"])].dropna(subset=["lat","lon"])
        if clu.empty:
            warnings.warn("DHS GPS present but no overlap with env DHSIDs; falling back to national redistribution.")
            clu = None

    # 4) Compute clinic-level weights
    if clu is not None:
        # nearest cluster id for each clinic
        clinic_to_dhs = nearest_cluster(clinics[["latitude","longitude"]], clu[["DHSID","lat","lon"]])
        clinics = clinics.join(clinic_to_dhs.rename("DHSID"))
        clinics = clinics.merge(env[["DHSID","need_index"]], on="DHSID", how="left")
        # fallback if some clinics missing mapping
        clinics["need_index"] = clinics["need_index"].fillna(clinics["need_index"].median())
        clin_weights = clinics[["clinic_id","need_index"]].rename(columns={"need_index":"need_weight"})
    else:
        # no spatial mapping -> use a single DHS distribution scalar = 1 for everyone
        clin_weights = visits[["clinic_id"]].drop_duplicates().copy()
        clin_weights["need_weight"] = 1.0

    # 5) Join weights to visits and rescale per month
    v = visits.merge(clin_weights, on="clinic_id", how="left")
    v["need_weight"] = v["need_weight"].fillna(v["need_weight"].median())
    v2 = rescale_within_month(v, "need_weight")

    # 6) Save: overwrite visits and produce a tiny diff sample for audit
    # Make a sample diff (first 10 clinics x 2 months)
    sample = (v[["clinic_id","month","total_visits"]]
              .merge(v2[["clinic_id","month","total_visits"]], on=["clinic_id","month"], suffixes=("_before","_after"))
              .head(200))
    DIFF_LOG.parent.mkdir(parents=True, exist_ok=True)
    sample.to_csv(DIFF_LOG, index=False)

    v2.to_csv(OUT_VISITS, index=False)
    print(f"✅ Upgraded visits saved to {OUT_VISITS} (preserved monthly totals).")
    print(f"🔍 Diff sample written to {DIFF_LOG}")

if __name__ == "__main__":
    main()
