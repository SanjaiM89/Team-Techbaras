import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Bell, Crown, MessageSquare, LogOut, Star,
  ThumbsUp, AlertCircle, Camera, Edit2, Save, X,
  Brain, Video, Calendar, Lock, Zap, Gift
} from 'lucide-react';

function Settings() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: 'sanjai',
    email: 'sanjai@gmail.com',
    height: '195',
    weight: '95',
    goals: ['Weight Loss', 'Muscle Gain'],
    notifications: {
      workouts: true,
      meals: true,
      progress: true,
      tips: false
    }
  });

  const premiumFeatures = [
    {
      icon: Brain,
      title: 'AI Form Correction',
      description: 'Real-time form analysis and feedback during workouts',
      included: true
    },
    {
      icon: Video,
      title: 'Personal Trainer Sessions',
      description: '4 video sessions per month with certified trainers',
      included: true
    },
    {
      icon: Calendar,
      title: 'Advanced Workout Planning',
      description: 'AI-powered personalized workout schedules',
      included: true
    },
    {
      icon: Lock,
      title: 'Premium Exercises',
      description: 'Access to exclusive workout routines',
      included: true
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: '24/7 priority customer support',
      included: true
    },
    {
      icon: Gift,
      title: 'Nutrition Consultation',
      description: 'Monthly consultation with nutrition experts',
      included: true
    }
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSection(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleNotificationUpdate = (key: keyof typeof profile.notifications) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSection(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubscribe = async () => {
    // In a real app, this would integrate with Stripe
    console.log('Initiating subscription process');
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 pb-24"
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account</p>
      </header>

      <div className="space-y-4 mb-8">
        <button
          onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
          className="w-full bg-dark-light hover:bg-dark-lighter transition-colors p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center">
            <User className="text-primary mr-3" />
            <span>Profile Settings</span>
          </div>
          {activeSection === 'profile' ? <X /> : <Edit2 />}
        </button>

        <AnimatePresence>
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-dark-lighter rounded-xl p-6"
            >
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                      className="w-full bg-dark text-white px-4 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                      className="w-full bg-dark text-white px-4 py-2 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-dark font-semibold py-3 rounded-lg flex items-center justify-center"
                >
                  <Save className="mr-2" />
                  Save Changes
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
          className="w-full bg-dark-light hover:bg-dark-lighter transition-colors p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center">
            <Bell className="text-primary mr-3" />
            <span>Notifications</span>
          </div>
          {activeSection === 'notifications' ? <X /> : <Edit2 />}
        </button>

        <AnimatePresence>
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-dark-lighter rounded-xl p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Workout Reminders</h3>
                    <p className="text-sm text-gray-400">Get notified about upcoming workouts</p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate('workouts')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.notifications.workouts ? 'bg-primary' : 'bg-dark'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.notifications.workouts ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Meal Reminders</h3>
                    <p className="text-sm text-gray-400">Get notified about meal prep times</p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate('meals')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.notifications.meals ? 'bg-primary' : 'bg-dark'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.notifications.meals ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Progress Updates</h3>
                    <p className="text-sm text-gray-400">Weekly progress notifications</p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate('progress')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.notifications.progress ? 'bg-primary' : 'bg-dark'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.notifications.progress ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Daily Tips</h3>
                    <p className="text-sm text-gray-400">Receive fitness and nutrition tips</p>
                  </div>
                  <button
                    onClick={() => handleNotificationUpdate('tips')}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      profile.notifications.tips ? 'bg-primary' : 'bg-dark'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        profile.notifications.tips ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setActiveSection(activeSection === 'premium' ? null : 'premium')}
          className="w-full bg-dark-light hover:bg-dark-lighter transition-colors p-4 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center">
            <Crown className="text-yellow-500 mr-3" />
            <span>Premium Subscription</span>
          </div>
          {activeSection === 'premium' ? <X /> : <Edit2 />}
        </button>

        <AnimatePresence>
          {activeSection === 'premium' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-dark-lighter rounded-xl p-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Premium Features</h3>
                <p className="text-gray-400">Unlock advanced features and personalized training</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="bg-dark rounded-xl p-4">
                    <feature.icon className="text-primary mb-2" size={24} />
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-2">
                  ₹99
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="text-gray-400">Cancel anytime • 7-day free trial</p>
              </div>

              <button
                onClick={handleSubscribe}
                className="w-full bg-primary text-dark font-semibold py-4 rounded-xl flex items-center justify-center"
              >
                <Crown className="mr-2" />
                Start Free Trial
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">User Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Feedback Type</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFeedbackType('general')}
                className={`p-3 rounded-xl flex flex-col items-center ${
                  feedbackType === 'general' ? 'bg-primary text-dark' : 'bg-dark-light'
                }`}
              >
                <MessageSquare className="mb-2" />
                <span className="text-sm">General</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('feature')}
                className={`p-3 rounded-xl flex flex-col items-center ${
                  feedbackType === 'feature' ? 'bg-primary text-dark' : 'bg-dark-light'
                }`}
              >
                <Star className="mb-2" />
                <span className="text-sm">Feature</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('bug')}
                className={`p-3 rounded-xl flex flex-col items-center ${
                  feedbackType === 'bug' ? 'bg-primary text-dark' : 'bg-dark-light'
                }`}
              >
                <AlertCircle className="mb-2" />
                <span className="text-sm">Bug</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-lg ${
                    rating >= star ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-dark-light rounded-xl p-4 min-h-[120px] text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-dark font-semibold py-4 rounded-xl flex items-center justify-center"
          >
            <ThumbsUp className="mr-2" />
            Submit Feedback
          </button>
        </form>
      </section>

      <button 
        onClick={handleSignOut}
        className="w-full bg-dark-light hover:bg-dark-lighter transition-colors p-4 rounded-xl flex items-center justify-between mt-8"
      >
        <div className="flex items-center">
          <LogOut className="text-red-500 mr-3" />
          <span className="text-red-500">Sign Out</span>
        </div>
      </button>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-dark px-6 py-3 rounded-lg shadow-lg"
          >
            <p className="font-semibold">Changes saved successfully! +100 XP</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Settings;