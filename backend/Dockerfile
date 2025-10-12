FROM python:3.10-slim
WORKDIR /app

# faster, fewer resolver issues
RUN pip install --no-cache-dir --upgrade pip

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Keras 3 uses pluggable backends; we want TensorFlow
ENV KERAS_BACKEND=tensorflow
# optional: quieter TF logs
ENV TF_CPP_MIN_LOG_LEVEL=2

COPY backend /app/backend
COPY docs /app/docs

ENV MODEL_PATH="/app/docs/malaria_mlp_model.pkl"
ENV MODEL_META_PATH="/app/backend/models/model_meta.json"

EXPOSE 8000
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
