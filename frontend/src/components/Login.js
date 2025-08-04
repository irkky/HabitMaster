import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { access_token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 gradient-text">
            HabitMaster
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Your daily habit tracker
          </p>
          <div className="hidden lg:block">
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="text-white font-semibold mb-4">Why HabitMaster?</h3>
              <ul className="text-white/70 space-y-2">
                <li>• Track your daily habits effortlessly</li>
                <li>• Visualize your progress with charts</li>
                <li>• Stay motivated with daily inspiration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="glass-effect p-8 rounded-2xl shadow-2xl animate-bounce-in">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Welcome Back!
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;