from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime
import os
import jwt

app = FastAPI()

# MongoDB connection
MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/habitmaster")
client = MongoClient(MONGO_URL)
db = client.habitmaster

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
JWT_ALGORITHM = "HS256"

security = HTTPBearer()

class HabitComplete(BaseModel):
    habit_id: str

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

@app.post("/")
async def complete_habit(habit_complete: HabitComplete, current_user: dict = Depends(get_current_user)):
    today = datetime.now().strftime("%Y-%m-%d")
    
    result = db.habits.update_one(
        {"id": habit_complete.habit_id, "user_id": current_user["id"]},
        {"$addToSet": {"completed_dates": today}}
    )
    
    if result.modified_count:
        return {"message": "Habit marked as completed"}
    else:
        raise HTTPException(status_code=404, detail="Habit not found or already completed")

handler = app