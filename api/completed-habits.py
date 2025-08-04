from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
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
async def get_completed_habits(current_user: dict = Depends(get_current_user)):
    today = datetime.now().strftime("%Y-%m-%d")
    habits = list(db.habits.find({"user_id": current_user["id"]}))
    
    completed = []
    pending = []
    
    for habit in habits:
        habit_data = {
            "id": habit["id"],
            "name": habit["name"],
            "time": habit["time"],
            "days": habit["days"]
        }
        
        if today in habit.get("completed_dates", []):
            completed.append(habit_data)
        else:
            pending.append(habit_data)
    
    return {"completed": completed, "pending": pending}

handler = app