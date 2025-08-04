import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        {/* Animated Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 relative">
            <span className="inline-block animate-pulse-slow">H</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.1s'}}>a</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.2s'}}>b</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.3s'}}>i</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.4s'}}>t</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.5s'}}>M</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.6s'}}>a</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.7s'}}>s</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.8s'}}>t</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '0.9s'}}>e</span>
            <span className="inline-block animate-pulse-slow" style={{animationDelay: '1s'}}>r</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Your daily habit tracker
          </p>
        </div>

        {/* 3D Effect Cards */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <div className="glass-effect p-8 rounded-2xl transform rotate-3 shadow-2xl">
              <div className="text-white text-4xl font-bold">HabitMaster</div>
            </div>
            <div className="glass-effect p-8 rounded-2xl transform -rotate-3 shadow-2xl">
              <div className="text-white text-4xl font-bold">HabitMaster</div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/login')}
          className="btn-gradient text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          <div className="glass-effect p-6 rounded-xl text-center animate-fadeIn">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-white font-semibold mb-2">Track Progress</h3>
            <p className="text-white/70 text-sm">Visualize your habit completion with beautiful progress bars</p>
          </div>
          <div className="glass-effect p-6 rounded-xl text-center animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-white font-semibold mb-2">Complete Habits</h3>
            <p className="text-white/70 text-sm">Mark your daily habits as complete and build consistency</p>
          </div>
          <div className="glass-effect p-6 rounded-xl text-center animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-white font-semibold mb-2">Stay Motivated</h3>
            <p className="text-white/70 text-sm">Get daily motivation to keep you going strong</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;