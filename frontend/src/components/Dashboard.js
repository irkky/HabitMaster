import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { habitsAPI } from '../services/api';
import AddHabitModal from './AddHabitModal';
import ProgressSection from './ProgressSection';
import MotivationSection from './MotivationSection';

const Dashboard = ({ setIsAuthenticated }) => {
  const [activeSection, setActiveSection] = useState('activities');
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState({ completed: [], pending: [] });
  const [progress, setProgress] = useState({ total_habits: 0, completed_today: 0, progress_percentage: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [habitsRes, completedRes, progressRes] = await Promise.all([
        habitsAPI.getHabits(),
        habitsAPI.getCompletedHabits(),
        habitsAPI.getProgress()
      ]);
      
      setHabits(habitsRes.data);
      setCompletedHabits(completedRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habitData) => {
    try {
      await habitsAPI.createHabit(habitData);
      await fetchData(); // Refresh data
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await habitsAPI.completeHabit(habitId);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  const menuItems = [
    { id: 'activities', label: 'Activities', icon: '📋' },
    { id: 'completed', label: 'Completed', icon: '✅' },
    { id: 'progress', label: 'Track Progress', icon: '📊' },
    { id: 'motivation', label: 'Daily Motivation', icon: '💪' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 glass-effect p-6 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">HabitMaster</h1>
            <p className="text-white/70">Welcome back, {user?.username}!</p>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-300 ${
                  activeSection === item.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-lg">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="absolute bottom-6 left-6 right-6 bg-red-500/20 hover:bg-red-500/30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeSection === 'activities' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Your Activities</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-gradient text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Add Habit</span>
                </button>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl text-white font-semibold mb-4">
                  Good habits make an ordinary day extraordinary
                </h3>
              </div>

              {habits.length === 0 ? (
                <div className="glass-effect p-8 rounded-xl text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-white text-xl mb-2">No habits yet</h3>
                  <p className="text-white/70">Start building great habits today!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {habits.map((habit) => (
                    <div key={habit.id} className="habit-card p-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{habit.name}</h4>
                          <p className="text-white/70">Time: {habit.time}</p>
                          <p className="text-white/70">Days: {habit.days.join(', ')}</p>
                        </div>
                        <div className="text-2xl">⭐</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'completed' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold text-white mb-8">Completed Activities</h2>
              
              <div className="grid gap-8">
                {/* Pending Activities */}
                <div className="glass-effect p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Pending Work</h3>
                  {completedHabits.pending.length === 0 ? (
                    <p className="text-white/70">All caught up! 🎉</p>
                  ) : (
                    <div className="space-y-3">
                      {completedHabits.pending.map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">{habit.name}</h4>
                            <p className="text-white/70 text-sm">Time: {habit.time}</p>
                          </div>
                          <button
                            onClick={() => handleCompleteHabit(habit.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Mark Complete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Activities */}
                <div className="glass-effect p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Completed Work</h3>
                  {completedHabits.completed.length === 0 ? (
                    <p className="text-white/70">No completed habits today</p>
                  ) : (
                    <div className="space-y-3">
                      {completedHabits.completed.map((habit) => (
                        <div key={habit.id} className="flex items-center bg-green-500/20 p-4 rounded-lg">
                          <div className="text-green-400 mr-3">✅</div>
                          <div>
                            <h4 className="text-white font-medium">{habit.name}</h4>
                            <p className="text-white/70 text-sm">Completed today</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'progress' && (
            <ProgressSection progress={progress} />
          )}

          {activeSection === 'motivation' && (
            <MotivationSection />
          )}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddHabit}
        />
      )}
    </div>
  );
};

export default Dashboard;