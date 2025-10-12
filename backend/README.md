# PHC Datathon — Model Serving API (FastAPI)

This service serves the malaria MLP model for prediction via a simple REST API.

## TL;DR

- **Health:** `GET /api/v1/health`
- **Model meta:** `GET /api/v1/model_meta` → lists expected feature names (order matters) and whether a scaler is used
- **Predict:** `POST /api/v1/predict` with:
  ```json
  { "records": [ { "<feature1>": 0, "<feature2>": 0, ... } ] }
