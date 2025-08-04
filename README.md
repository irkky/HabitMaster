# HabitMaster - Modern Habit Tracking Application

A comprehensive habit tracking application built with React frontend, FastAPI backend, and MongoDB database. This modernized version provides a clean, responsive interface for managing daily habits with progress tracking and motivational features.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Habit Management**: Create, view, and organize daily habits
- **Progress Tracking**: Visual progress bars and completion statistics
- **Daily Motivation**: Inspirational quotes and motivational content
- **Responsive Design**: Modern UI with Tailwind CSS and glass-morphism effects
- **Real-time Updates**: Live habit completion tracking

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database for data persistence
- **JWT Authentication** - Secure user authentication
- **Pydantic** - Data validation and serialization

## 📁 Project Structure

```
/app/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utility functions
│   ├── public/           # Static assets
│   ├── package.json      # Node.js dependencies
│   └── .env             # Frontend environment variables
└── supervisord.conf      # Process management configuration
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud instance)

### Environment Setup

1. **Backend Environment** (`/app/backend/.env`):
```env
MONGO_URL=mongodb://localhost:27017/habitmaster
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
```

2. **Frontend Environment** (`/app/frontend/.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Running the Application

The application uses Supervisor for process management:

```bash
# Start all services
sudo supervisorctl start all

# Check service status
sudo supervisorctl status

# Restart specific service
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Manual Setup (Development)

1. **Backend Setup**:
```bash
cd backend
pip install -r requirements.txt
python server.py
```

2. **Frontend Setup**:
```bash
cd frontend
yarn install
yarn start
```

## 📱 Application Flow

1. **Home Page** - Landing page with app introduction
2. **Registration** - New user account creation
3. **Login** - User authentication
4. **Dashboard** - Main application interface with:
   - **Activities**: Create and manage habits
   - **Completed**: Track completed vs pending habits
   - **Progress**: Visual progress tracking
   - **Motivation**: Daily inspiration and tips

## 🎨 UI/UX Features

- **Glass Morphism Design**: Modern frosted glass effects
- **Gradient Backgrounds**: Beautiful color gradients
- **Smooth Animations**: Fade-in and bounce effects
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Hover effects and transitions

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Habits
- `GET /api/habits` - Get user's habits
- `POST /api/habits` - Create new habit
- `POST /api/complete-habit` - Mark habit as completed
- `GET /api/completed-habits` - Get completed/pending habits
- `GET /api/progress` - Get progress statistics

## 🚀 Deployment

### Vercel Deployment
This application is optimized for Vercel deployment:

1. **Database**: Uses MongoDB Atlas for cloud database
2. **Environment Variables**: Configure in Vercel dashboard
3. **Build Process**: Automatic builds from Git repository

### Environment Variables for Production
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/habitmaster
JWT_SECRET_KEY=your-production-secret-key
REACT_APP_BACKEND_URL=https://your-api-domain.vercel.app
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Configured CORS middleware
- **Input Validation**: Pydantic model validation

## 🎯 Future Enhancements

- **Habit Streaks**: Track consecutive completion days
- **Habit Categories**: Organize habits by categories
- **Social Features**: Share progress with friends
- **Mobile App**: React Native mobile application
- **Analytics Dashboard**: Detailed habit analytics
- **Habit Templates**: Pre-built habit suggestions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Original HabitMaster concept
- React and FastAPI communities
- Tailwind CSS for the design system
- MongoDB for data persistence

---

**Built with ❤️ for better habit formation and personal growth**