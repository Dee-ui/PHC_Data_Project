# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.settings import router as health_router
from backend.routers.predict import router as predict_router

app = FastAPI(title="PHC Datathon API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://frontendpath.example"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(predict_router)
