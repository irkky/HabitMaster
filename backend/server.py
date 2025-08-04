from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import bcrypt
import jwt
import uuid

load_dotenv()

app = FastAPI(title="HabitMaster API", version="1.0.0")

# CORS middleware for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://*.vercel.app",  # Vercel frontend
        "http://localhost:3000",  # Local development
        "https://localhost:3000",  # Local development with HTTPS
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/habitmaster")
client = MongoClient(MONGO_URL)
db = client.habitmaster

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))

security = HTTPBearer()

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    dob: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    dob: str

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

class HabitComplete(BaseModel):
    habit_id: str

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

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

# API Routes
@app.get("/api/")
async def root():
    return {"message": "HabitMaster API is running"}

@app.post("/api/register", response_model=dict)
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = hash_password(user.password)
    user_doc = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "email": user.email,
        "dob": user.dob,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = db.users.insert_one(user_doc)
    if result.inserted_id:
        return {"message": "User registered successfully", "user_id": user_doc["id"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to register user")

@app.post("/api/login")
async def login_user(user: UserLogin):
    # Find user
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "username": db_user["username"],
            "email": db_user["email"]
        }
    }

@app.get("/api/habits", response_model=List[HabitResponse])
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

@app.post("/api/habits", response_model=dict)
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

@app.get("/api/completed-habits")
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

@app.post("/api/complete-habit")
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

@app.get("/api/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    today = datetime.now().strftime("%Y-%m-%d")
    habits = list(db.habits.find({"user_id": current_user["id"]}))
    
    total_habits = len(habits)
    completed_today = len([h for h in habits if today in h.get("completed_dates", [])])
    
    progress_percentage = (completed_today / total_habits * 100) if total_habits > 0 else 0
    
    return {
        "total_habits": total_habits,
        "completed_today": completed_today,
        "progress_percentage": progress_percentage
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)