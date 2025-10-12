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
        "All_Population_Count_2020": 17068.99,
        "Aridity_2020": 31.5398,
        "Day_Land_Surface_Temp_2020": 33.1447,
        "Diurnal_Temperature_Range_2020": 10.6614,
        "Drought_Episodes": 2,
        "Elevation": 177.79,
        "Enhanced_Vegetation_Index_2020": 0.3149,
        "Global_Human_Footprint": 25.4634,
        "Growing_Season_Length": 9,
        "Irrigation": 0,
        "ITN_Coverage_2020": 0.6532,
        "Land_Surface_Temperature_2020": 27.5642,
        "Livestock_Cattle": 1.6119,
        "Livestock_Chickens": 235.9055,
        "Livestock_Goats": 5.2326,
        "Livestock_Pigs": 12.078,
        "Livestock_Sheep": 1.3498,
        "Maximum_Temperature_2020": 33.0128,
        "Mean_Temperature_2020": 27.6595,
        "Minimum_Temperature_2020": 22.3514,
        "Nightlights_Composite": 0.1327,
        "Night_Land_Surface_Temp_2020": 21.9837,
        "PET_2020": 3.9004,
        "Precipitation_2020": 123.0175,
        "Rainfall_2020": 1183.9535,
        "Temperature_January": 26.7578,
        "Temperature_February": 28.6944,
        "Temperature_March": 29.8541,
        "Temperature_April": 29.4193,
        "Temperature_May": 27.652,
        "Temperature_June": 26.3222,
        "Temperature_July": 25.7066,
        "Temperature_August": 25.4953,
        "Temperature_September": 25.6926,
        "Temperature_October": 26.2119,
        "Temperature_November": 26.3688,
        "Temperature_December": 25.7387,
        "Travel_Times": 15.7266,
        "U5_Population_2020": 2805.6072,
        "UN_Population_Count_2020": 4232.873,
        "UN_Population_Density_2020": 198.4766,
        "Wet_Days_2020": 7.6266
      }
    ]
  }

