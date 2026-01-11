import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List
from ml.data_model import Employee, BadgeSwipe, AttendanceMode

class SyntheticDataGenerator:
    def __init__(self, num_employees=100, days=90):
        self.num_employees = num_employees
        self.days = days
        self.start_date = datetime.now() - timedelta(days=days)
        self.teams = ["Engineering", "Product", "Sales", "HR", "Finance"]
        self.floors = ["Floor 1", "Floor 2", "Floor 3"]
        self.employees = self._generate_employees()

    def _generate_employees(self) -> List[Employee]:
        employees = []
        for i in range(self.num_employees):
            employees.append(Employee(
                employee_id=f"EMP_{i:03d}",
                team_id=random.choice(self.teams),
                floor_id=random.choice(self.floors),
                designation=random.choice(["Junior", "Senior", "Lead", "Manager"]),
                home_location_zip=f"{random.randint(10000, 99999)}",
                office_frequency_target=10
            ))
        return employees

    def generate_badge_swipes(self):
        swipes = []
        for day_offset in range(self.days):
            current_date = self.start_date + timedelta(days=day_offset)
            # Skip weekends for simplicity or reduce probability
            if current_date.weekday() >= 5:
                continue
                
            for emp in self.employees:
                # Simple behavioral logic: Some people love 3 days a week, some do min 10
                # Higher prob for Tues-Thurs (typical hybrid pattern)
                base_prob = 0.4
                if current_date.weekday() in [1, 2, 3]: # Tue-Thu
                    base_prob += 0.3
                
                if random.random() < base_prob:
                    # Swiped IN
                    swipes.append({
                        "employee_id": emp.employee_id,
                        "timestamp": current_date.replace(hour=random.randint(8, 10), minute=random.randint(0, 59)),
                        "building_id": "HQ",
                        "floor_id": emp.floor_id,
                        "direction": "IN"
                    })
                    # Swiped OUT
                    swipes.append({
                        "employee_id": emp.employee_id,
                        "timestamp": current_date.replace(hour=random.randint(16, 19), minute=random.randint(0, 59)),
                        "building_id": "HQ",
                        "floor_id": emp.floor_id,
                        "direction": "OUT"
                    })
        return pd.DataFrame(swipes)

    def generate_external_signals(self):
        signals = []
        for day_offset in range(self.days):
            current_date = self.start_date + timedelta(days=day_offset)
            signals.append({
                "date": current_date.date(),
                "weather_severity": random.uniform(0, 0.3) if random.random() > 0.1 else random.uniform(0.7, 1.0),
                "is_holiday": False,
                "traffic_index": random.uniform(0.8, 1.2)
            })
        return pd.DataFrame(signals)

if __name__ == "__main__":
    generator = SyntheticDataGenerator(num_employees=50, days=60)
    swipes_df = generator.generate_badge_swipes()
    signals_df = generator.generate_external_signals()
    
    # Save to data directory
    swipes_df.to_csv("data/badge_swipes.csv", index=False)
    signals_df.to_csv("data/external_signals.csv", index=False)
    
    print(f"Generated {len(swipes_df)} swipes and {len(signals_df)} signal records.")
