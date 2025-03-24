import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Dumbbell, Apple, Trophy, Users, X, Award, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      console.log('Token from localStorage:', token); // Debug log
      if (!token) {
        setError('Please log in to view the dashboard');
        navigate('/login'); // Redirect to login
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/dashboard/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleAddFriend = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Please log in to add a friend');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/dashboard/dashboard/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: friendUsername }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add friend');
      }
      const result = await response.json();
      alert(result.message);
      const updatedResponse = await fetch('http://localhost:8000/dashboard/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedResponse.json();
      setDashboardData(updatedData);
      setFriendUsername('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!dashboardData) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 pb-24 relative"
    >
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {dashboardData.username}</h1>
            <p className="text-gray-400">Level {Math.floor(dashboardData.xp / 100)} Fitness Warrior 💪</p>
          </div>
          <div className="flex items-center bg-dark-light rounded-xl px-3 py-2">
            <Zap className="text-yellow-500 mr-2" size={20} />
            <span className="font-bold">{dashboardData.xp} XP</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-dark-light rounded-xl p-4">
          <Activity className="text-primary mb-2" />
          <h3 className="font-semibold">Daily Streak</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-primary">{dashboardData.daily_streak}</p>
            <span className="text-gray-400 ml-2">days</span>
          </div>
        </div>
        <div className="bg-dark-light rounded-xl p-4">
          <Trophy className="text-yellow-500 mb-2" />
          <h3 className="font-semibold">Weekly Goal</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-yellow-500">{dashboardData.weekly_goals.completed}/{dashboardData.weekly_goals.goal}</p>
            <span className="text-gray-400 ml-2">workouts</span>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Today's Plan</h2>
        <Link to="/workout/strength" className="block bg-dark-light rounded-xl p-4 mb-4">
          <div className="flex items-center">
            <Dumbbell className="text-primary mr-3" />
            <div>
              <h3 className="font-semibold">Upper Body Strength</h3>
              <p className="text-sm text-gray-400">45 mins • +300 XP</p>
            </div>
          </div>
        </Link>
        <Link to="/meals" className="block bg-dark-light rounded-xl p-4">
          <div className="flex items-center">
            <Apple className="text-green-500 mr-3" />
            <div>
              <h3 className="font-semibold">Meal Prep</h3>
              <p className="text-sm text-gray-400">High Protein Lunch • +150 XP</p>
            </div>
          </div>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Achievements</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <div className="bg-dark-light rounded-xl p-4 flex-shrink-0">
            <Award className="text-yellow-500 mb-2" />
            <h3 className="font-semibold">Early Bird</h3>
            <p className="text-sm text-gray-400">5 morning workouts</p>
          </div>
          <div className="bg-dark-light rounded-xl p-4 flex-shrink-0">
            <Award className="text-primary mb-2" />
            <h3 className="font-semibold">Strength Master</h3>
            <p className="text-sm text-gray-400">20 strength workouts</p>
          </div>
          <div className="bg-dark-light rounded-xl p-4 flex-shrink-0">
            <Award className="text-purple-500 mb-2" />
            <h3 className="font-semibold">Social Butterfly</h3>
            <p className="text-sm text-gray-400">10 group workouts</p>
          </div>
        </div>
      </section>

      <button
        onClick={() => setShowCollaboration(true)}
        className="fixed bottom-20 right-6 bg-primary text-dark p-4 rounded-full shadow-lg"
      >
        <Users size={24} />
      </button>

      <AnimatePresence>
        {showCollaboration && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md">
              <div className="p-4 border-b border-dark-lighter flex justify-between items-center">
                <h2 className="text-xl font-bold">Social Hub</h2>
                <button onClick={() => setShowCollaboration(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Leaderboard</h3>
                  {dashboardData.leaderboard.map((user, index) => (
                    <div key={index} className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="w-8 text-primary">{user.rank}</span>
                        <span>{user.name}</span>
                      </div>
                      <span className="text-primary">{user.points} XP</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Friends</h3>
                  {dashboardData.friends.map((friend, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{friend.name}</span>
                        <span className="text-primary">{friend.xp} XP</span>
                      </div>
                      <p className="text-sm text-gray-400">{friend.status}</p>
                    </div>
                  ))}
                  <div className="mt-4">
                    <input
                      type="text"
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                      placeholder="Enter friend's username"
                      className="w-full p-2 rounded bg-dark-lighter text-white mb-2"
                    />
                    <button
                      onClick={handleAddFriend}
                      className="w-full bg-primary text-dark p-2 rounded"
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Dashboard;