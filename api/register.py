from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from datetime import datetime
import os
import bcrypt
import uuid

app = FastAPI()

# MongoDB connection
MONGO_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/habitmaster")
client = MongoClient(MONGO_URL)
db = client.habitmaster

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    dob: str
    password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

@app.post("/")
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

handler = app