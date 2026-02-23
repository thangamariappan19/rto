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
    """Returns predicted occupancy for the next N days with weekly cycles."""
    today = date.today()
    forecast = []
    for i in range(days):
        target_date = today + timedelta(days=i)
        weekday = target_date.weekday()
        
        # Realistic weekly pattern: Tue-Thu are peaks, Mon/Fri lower, Sat/Sun minimal
        if weekday in [1, 2, 3]: # Tue, Wed, Thu
            base_occupancy = random.randint(85, 95)
        elif weekday in [0, 4]: # Mon, Fri
            base_occupancy = random.randint(60, 75)
        else: # Weekend
            base_occupancy = random.randint(5, 15)
            
        noise = random.randint(-5, 5)
        
        forecast.append({
            "date": target_date.isoformat(),
            "predicted_occupancy": max(0, base_occupancy + noise),
            "confidence_score": 0.92 if weekday < 5 else 0.98
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
