# PHC Datathon — Model Serving API (FastAPI)

This service serves the malaria MLP model for prediction via a simple REST API.

## TL;DR

- **Health:** `GET /api/v1/health`
- **Model meta:** `GET /api/v1/model_meta` → lists expected feature names (order matters) and whether a scaler is used
- **Predict:** `POST /api/v1/predict` with:
    ```json
    {
    "records": [
        {
        "All_Population_Count": 0,
        "Aridity": 0,
        "Day_Land_Surface_Temp": 0,
        "Diurnal_Temperature_Range": 0,
        "Enhanced_Vegetation_Index": 0,
        "Frost_Days": 0,
        "ITN_Coverage": 0,
        "Land_Surface_Temperature": 0,
        "Malaria_Incidence": 0,
        "Maximum_Temperature": 0,
        "Mean_Temperature": 0,
        "Minimum_Temperature": 0,
        "Night_Land_Surface_Temp": 0,
        "PET": 0,
        "Precipitation": 0,
        "Rainfall": 0,
        "U5_Population": 0,
        "UN_Population_Count": 0,
        "UN_Population_Density": 0,
        "Wet_Days": 0,
        "prev_lag1": 0,
        "prev_roll3": 0
        }
    ]
    }
