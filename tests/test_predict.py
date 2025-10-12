# tests/test_predict.py
import os, requests

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

def test_health():
    response = requests.get(f"{BASE_URL}/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_predict_zeros():
    meta = requests.get(f"{BASE_URL}/api/v1/model_meta").json()
    feat = meta["features"]
    record = {f: 0 for f in feat}
    response = requests.post(f"{BASE_URL}/api/v1/predict", json={"records": [record]})
    assert response.status_code == 200
    preds = response.json().get("preds", [])
    assert all(p == 0 for p in preds)
