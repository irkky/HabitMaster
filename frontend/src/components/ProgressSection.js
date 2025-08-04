import React from 'react';

const ProgressSection = ({ progress }) => {
  const { total_habits, completed_today, progress_percentage } = progress;

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-8">Track Progress</h2>
      
      <div className="grid gap-8">
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-effect p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-white mb-2">{total_habits}</div>
            <p className="text-white/70">Total Habits</p>
          </div>
          <div className="glass-effect p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{completed_today}</div>
            <p className="text-white/70">Completed Today</p>
          </div>
          <div className="glass-effect p-6 rounded-xl text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{Math.round(progress_percentage)}%</div>
            <p className="text-white/70">Success Rate</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="glass-effect p-8 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Daily Progress</h3>
          
          <div className="flex items-center justify-center">
            {/* Vertical Progress Bar */}
            <div className="flex items-end space-x-8">
              <div className="flex flex-col items-center">
                <div className="h-80 w-16 bg-white/20 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full progress-bar rounded-full transition-all duration-1000 ease-out"
                    style={{ height: `${progress_percentage}%` }}
                  ></div>
                </div>
                <p className="text-white font-medium mt-4">Progress</p>
              </div>

              {/* Legend */}
              <div className="glass-effect p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
                    <span className="text-white/70 text-sm">Completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white/20 rounded"></div>
                    <span className="text-white/70 text-sm">Not Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Message */}
          <div className="text-center mt-8">
            {progress_percentage === 100 ? (
              <div className="text-green-400 font-semibold text-lg">
                🎉 Perfect day! All habits completed!
              </div>
            ) : progress_percentage >= 75 ? (
              <div className="text-blue-400 font-semibold text-lg">
                🌟 Great progress! Keep it up!
              </div>
            ) : progress_percentage >= 50 ? (
              <div className="text-yellow-400 font-semibold text-lg">
                💪 Good work! Push a little more!
              </div>
            ) : (
              <div className="text-white/70 font-semibold text-lg">
                🚀 Let's build those habits!
              </div>
            )}
          </div>
        </div>

        {/* Weekly Overview (Placeholder) */}
        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4">This Week Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-white/70 text-sm mb-2">{day}</div>
                <div className={`h-8 rounded ${index <= 4 ? 'bg-green-500/50' : 'bg-white/20'}`}></div>
              </div>
            ))}
          </div>
          <p className="text-white/70 text-sm mt-4 text-center">
            Consistency is key to building lasting habits
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;