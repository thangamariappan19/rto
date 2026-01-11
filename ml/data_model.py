from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Optional
from enum import Enum

class AttendanceMode(str, Enum):
    OFFICE = "office"
    REMOTE = "remote"
    AWAY = "away"

class Employee(BaseModel):
    employee_id: str
    team_id: str
    floor_id: str
    designation: str
    home_location_zip: str
    office_frequency_target: int = 10  # Days per month

class BadgeSwipe(BaseModel):
    employee_id: str
    timestamp: datetime
    building_id: str
    floor_id: str
    direction: str  # IN/OUT

class CalendarEvent(BaseModel):
    event_id: str
    organizer_id: str
    attendee_ids: List[str]
    start_time: datetime
    end_time: datetime
    is_virtual: bool
    location: Optional[str] = None
    event_type: str  # Meeting, Focus, Out of Office

class ExternalSignals(BaseModel):
    date: date
    weather_severity: float  # 0.0 to 1.0
    is_holiday: bool
    traffic_index: float  # 0.0 to 1.0 (relative to baseline)

class DailyOccupancyPrediction(BaseModel):
    date: date
    target_id: str  # Global, Floor_X, Team_Y
    predicted_count: int
    confidence_interval: List[int]  # [lower, upper]
