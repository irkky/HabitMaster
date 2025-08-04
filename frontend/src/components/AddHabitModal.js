import React, { useState } from 'react';

const AddHabitModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    time: '',
    days: []
  });

  const daysOfWeek = [
    { value: 'mon', label: 'MON' },
    { value: 'tue', label: 'TUE' },
    { value: 'wed', label: 'WED' },
    { value: 'thu', label: 'THU' },
    { value: 'fri', label: 'FRI' },
    { value: 'sat', label: 'SAT' },
    { value: 'sun', label: 'SUN' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDayToggle = (day) => {
    const updatedDays = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    
    setFormData({
      ...formData,
      days: updatedDays
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.days.length === 0) {
      alert('Please select at least one day');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
      <div className="glass-effect p-8 rounded-2xl max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Add New Habit</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Habit Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter habit name"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-2">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium block mb-3">
              Days of Week
            </label>
            <div className="grid grid-cols-4 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    formData.days.includes(day.value)
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 text-white font-medium py-3 px-4 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient text-white font-medium py-3 px-4 rounded-lg"
            >
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;