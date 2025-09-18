import pandas as pd
import numpy as np

def load_data(path):
    df = pd.read_csv(path, encoding="utf-8", low_memory=False)
    return df

def recommend_crop(df, district, crop):
    df["_year"] = df["Agriculture Year"].astype(str).str.extract(r"(\d{4})").astype(float)
    df["_district"] = df["District"].astype(str).str.title().str.strip()
    df["_crop"] = df["Crop"].astype(str).str.title().str.strip()
    df["_prod"] = pd.to_numeric(df["Production Growth"], errors="coerce")

    subset = df[(df["_district"] == district.title()) & (df["_crop"].str.contains(crop, case=False))]
    if subset.empty:
        return f"No history found for {crop} in {district}."

    ts = subset.groupby("_year")["_prod"].sum().sort_values()
    ts = ts.dropna()
    if len(ts) < 2:
        return f"Not enough years of data for {crop} in {district}."

    # Calculate mean of last 3 year-on-year growths
    ts_pct = ts.pct_change() * 100
    mean_recent = ts_pct.tail(3).mean()

    if mean_recent > 0:
        return f"Yes — {crop} shows positive growth trend in {district} (avg {mean_recent:.2f}%)."
    else:
        return f"No — {crop} shows negative/flat growth trend in {district} (avg {mean_recent:.2f}%)."

def best_crop_for_district(df, district):
    df["_year"] = df["Agriculture Year"].astype(str).str.extract(r"(\d{4})").astype(float)
    df["_district"] = df["District"].astype(str).str.title().str.strip()
    df["_crop"] = df["Crop"].astype(str).str.title().str.strip()
    df["_prod"] = pd.to_numeric(df["Production Growth"], errors="coerce")

    subset = df[df["_district"] == district.title()]
    if subset.empty:
        return f"No data for {district}."

    results = []
    for crop, grp in subset.groupby("_crop"):
        grp = grp.sort_values("_year")
        if len(grp) < 2:
            continue

        start_year, end_year = grp["_year"].iloc[0], grp["_year"].iloc[-1]
        start_val, end_val = grp["_prod"].iloc[0], grp["_prod"].iloc[-1]

        if start_val <= 0 or end_val <= 0 or end_year <= start_year:
            continue

        years = end_year - start_year
        cagr = ((end_val / start_val) ** (1 / years) - 1) * 100
        results.append((crop, cagr))

    if not results:
        return f"Not enough valid data for growth trends in {district}."

    best_crop, best_cagr = max(results, key=lambda x: x[1])
    return f"In {district}, {best_crop} has the highest average growth rate (CAGR): {best_cagr:.2f}%."
