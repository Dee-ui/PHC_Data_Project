# backend/Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend /app/backend
COPY docs /app/docs
ENV MODEL_PATH="/app/docs/malaria_mlp_model(1).pkl"
# Optional for when I add them:
# ENV SCALER_PATH="/app/backend/models/scaler_site_year.joblib"
ENV MODEL_META_PATH="/app/backend/models/model_meta.json"
EXPOSE 8000
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
