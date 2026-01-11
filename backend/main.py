from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import date, timedelta
from typing import List, Dict
import random

app = FastAPI(title="RTO Predictive Analytics API")

# Enable CORS for Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "RTO Predictive Analytics API is active"}

@app.get("/forecast/daily")
def get_daily_forecast(days: int = 30):
    """Returns predicted occupancy for the next N days."""
    today = date.today()
    forecast = []
    for i in range(days):
        target_date = today + timedelta(days=i)
        # Simulate weekend drop
        is_weekend = target_date.weekday() >= 5
        base_occupancy = 120 if not is_weekend else 10
        noise = random.randint(-15, 15) if not is_weekend else random.randint(0, 5)
        
        forecast.append({
            "date": target_date.isoformat(),
            "predicted_occupancy": max(0, base_occupancy + noise),
            "confidence_score": 0.85 if not is_weekend else 0.98
        })
    return forecast

@app.get("/insights/utilization")
def get_utilization():
    """Returns team and floor level utilization insights."""
    return {
        "teams": [
            {"name": "Engineering", "utilization": 85, "trend": "up"},
            {"name": "Product", "utilization": 72, "trend": "stable"},
            {"name": "Sales", "utilization": 45, "trend": "down"},
            {"name": "HR", "utilization": 60, "trend": "stable"},
            {"name": "Finance", "utilization": 92, "trend": "up"}
        ],
        "floors": [
            {"id": "Floor 1", "occupancy": 88, "status": "High"},
            {"id": "Floor 2", "occupancy": 64, "status": "Medium"},
            {"id": "Floor 3", "occupancy": 32, "status": "Low"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
