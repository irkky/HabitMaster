# 🚀 HabitMaster Backend Deployment on Railway

## ✅ Configuration Complete

Your FastAPI backend is now ready for Railway deployment with:
- ✅ MongoDB Atlas connection configured
- ✅ Secure JWT secret generated
- ✅ CORS configured for Vercel integration
- ✅ Railway deployment files created

## 🎯 Step-by-Step Deployment Instructions

### Step 1: Push Backend to GitHub

```bash
# Navigate to your backend directory
cd /app/backend

# Initialize git if not already done
git init
git add .
git commit -m "Prepare backend for Railway deployment"

# Push to your GitHub repository (create a new repo called "habitmaster-backend")
git remote add origin https://github.com/YOUR_USERNAME/habitmaster-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your "habitmaster-backend" repository**
6. **Railway will automatically detect it's a Python app**

### Step 3: Set Environment Variables

In Railway dashboard:
1. **Go to your project → Variables tab**
2. **Add these variables as "Sealed Variables" (for security):**

```
MONGODB_URI = mongodb+srv://irkky:8QL196ZNj9qtb6hg@cluster0.ktlyyzz.mongodb.net/habitmaster?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = d6msdLPzoVVrTb4JaKtLNWvQUmU31sloUK7sGVELWm4

JWT_ALGORITHM = HS256

JWT_EXPIRE_MINUTES = 30

PORT = 8000
```

### Step 4: Enable Public Domain

1. **In Railway project → Settings → Networking**
2. **Click "Generate Domain"**
3. **You'll get a URL like: `habitmaster-backend-production.up.railway.app`**
4. **Copy this URL - you'll need it for frontend configuration**

### Step 5: Test Backend Deployment

Once deployed, test your backend:

```bash
# Test root endpoint
curl https://your-railway-url.up.railway.app/api/

# Test registration
curl -X POST https://your-railway-url.up.railway.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "dob": "1990-01-01",
    "password": "testpass123"
  }'
```

### Step 6: Update Frontend Configuration

Once you have your Railway backend URL, update the frontend:

```bash
# Update frontend/.env.production
REACT_APP_BACKEND_URL=https://your-actual-railway-url.up.railway.app
```

## 🔧 Files Created for Deployment

- ✅ `Procfile` - Railway deployment command
- ✅ `railway.json` - Railway configuration  
- ✅ `.env.production` - Production environment variables
- ✅ Updated `server.py` - CORS and environment variable compatibility

## 🎯 What Happens Next

1. **Backend deploys to Railway** (free tier: $5 credit monthly)
2. **Get Railway backend URL**
3. **Update frontend to use Railway backend**
4. **Deploy frontend to Vercel**
5. **Complete full-stack app running in production!**

## 🚨 Important Security Notes

- ✅ MongoDB credentials are stored as sealed variables
- ✅ JWT secret is securely generated and sealed
- ✅ CORS is configured specifically for Vercel domains
- ✅ All sensitive data is environment-based

## 🔄 Next Steps

After successful Railway deployment:
1. Copy your Railway backend URL
2. I'll update the frontend configuration
3. Deploy frontend to Vercel
4. Test the complete application

Ready to deploy! 🚀