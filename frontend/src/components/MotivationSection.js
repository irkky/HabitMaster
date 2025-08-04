import React, { useState, useEffect } from 'react';

const MotivationSection = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const motivationalQuotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Success is the sum of small efforts, repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle"
    },
    {
      text: "The groundwork for all happiness is good health.",
      author: "Leigh Hunt"
    },
    {
      text: "Take care of your body. It's the only place you have to live.",
      author: "Jim Rohn"
    },
    {
      text: "A year from now you may wish you had started today.",
      author: "Karen Lamb"
    },
    {
      text: "The best time to plant a tree was 20 years ago. The second best time is now.",
      author: "Chinese Proverb"
    }
  ];

  const motivationalImages = [
    {
      emoji: "🌅",
      title: "New Day, New Opportunities",
      color: "from-orange-400 to-pink-400"
    },
    {
      emoji: "💪",
      title: "Strength Grows Daily",
      color: "from-blue-400 to-purple-400"
    },
    {
      emoji: "🎯",
      title: "Focus on Your Goals",
      color: "from-green-400 to-blue-400"
    },
    {
      emoji: "🚀",
      title: "Progress Over Perfection",
      color: "from-purple-400 to-pink-400"
    },
    {
      emoji: "🌟",
      title: "You Are Capable",
      color: "from-yellow-400 to-orange-400"
    }
  ];

  useEffect(() => {
    // Change quote every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 10000);

    // Change image every 15 seconds
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % motivationalImages.length);
    }, 15000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(imageInterval);
    };
  }, []);

  const handleNextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev + 1) % motivationalImages.length);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-8">Daily Dose of Motivation</h2>
      
      <div className="grid gap-8">
        {/* Motivational Image Section */}
        <div className="glass-effect p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Visual Inspiration</h3>
          
          <div className={`bg-gradient-to-br ${motivationalImages[currentImage].color} p-12 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="text-8xl mb-4 animate-pulse-slow">
              {motivationalImages[currentImage].emoji}
            </div>
            <h4 className="text-3xl font-bold text-white mb-4">
              {motivationalImages[currentImage].title}
            </h4>
            <p className="text-white/80 text-lg">
              Every step forward is progress worth celebrating
            </p>
          </div>

          <button
            onClick={handleNextImage}
            className="mt-6 btn-gradient text-white font-medium py-2 px-6 rounded-lg"
          >
            New Inspiration
          </button>
        </div>

        {/* Motivational Quote Section */}
        <div className="glass-effect p-8 rounded-xl text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Quote of the Moment</h3>
          
          <div className="bg-white/10 p-8 rounded-xl">
            <div className="text-6xl text-white/30 mb-4">"</div>
            <blockquote className="text-2xl text-white font-light leading-relaxed mb-6 italic">
              {motivationalQuotes[currentQuote].text}
            </blockquote>
            <p className="text-white/70 font-medium">
              — {motivationalQuotes[currentQuote].author}
            </p>
          </div>

          <button
            onClick={handleNextQuote}
            className="mt-6 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            New Quote
          </button>
        </div>

        {/* Habit Tips Section */}
        <div className="glass-effect p-8 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Habit Building Tips</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-3xl mb-3">🔥</div>
              <h4 className="text-white font-semibold mb-2">Start Small</h4>
              <p className="text-white/70 text-sm">
                Begin with tiny habits that are easy to maintain. Small wins build momentum.
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-3xl mb-3">🔄</div>
              <h4 className="text-white font-semibold mb-2">Be Consistent</h4>
              <p className="text-white/70 text-sm">
                Consistency beats intensity. Show up every day, even if it's just for 5 minutes.
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-3xl mb-3">🎉</div>
              <h4 className="text-white font-semibold mb-2">Celebrate Wins</h4>
              <p className="text-white/70 text-sm">
                Acknowledge your progress. Every completed habit is a victory worth celebrating.
              </p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="text-white font-semibold mb-2">Find Support</h4>
              <p className="text-white/70 text-sm">
                Share your goals with friends or family. Accountability partners make a difference.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Reminder */}
        <div className="glass-effect p-6 rounded-xl text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-white font-semibold text-lg mb-2">
            Remember: Progress, Not Perfection
          </h3>
          <p className="text-white/70">
            Every day you show up is a day you're building the person you want to become.
            Keep going, you've got this! 💪
          </p>
        </div>
      </div>
    </div>
  );
};

export default MotivationSection;