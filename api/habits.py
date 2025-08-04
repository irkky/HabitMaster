from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List
from datetime import datetime
import os
import jwt
import uuid

app = FastAPI()

# MongoDB connection
MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/habitmaster")
client = MongoClient(MONGO_URL)
db = client.habitmaster

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"

security = HTTPBearer()

class HabitCreate(BaseModel):
    name: str
    time: str
    days: List[str]

class HabitResponse(BaseModel):
    id: str
    name: str
    time: str
    days: List[str]
    user_id: str
    created_at: datetime

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = db.users.find_one({"email": user_email})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.get("/")
async def get_habits(current_user: dict = Depends(get_current_user)):
    habits = list(db.habits.find({"user_id": current_user["id"]}))
    return [
        {
            "id": habit["id"],
            "name": habit["name"],
            "time": habit["time"],
            "days": habit["days"],
            "user_id": habit["user_id"],
            "created_at": habit["created_at"]
        }
        for habit in habits
    ]

@app.post("/")
async def create_habit(habit: HabitCreate, current_user: dict = Depends(get_current_user)):
    habit_doc = {
        "id": str(uuid.uuid4()),
        "name": habit.name,
        "time": habit.time,
        "days": habit.days,
        "user_id": current_user["id"],
        "created_at": datetime.utcnow(),
        "completed_dates": []
    }
    
    result = db.habits.insert_one(habit_doc)
    if result.inserted_id:
        return {"message": "Habit created successfully", "habit_id": habit_doc["id"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to create habit")

handler = app