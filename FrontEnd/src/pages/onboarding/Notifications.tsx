import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, Calendar, Activity } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function Notifications() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    workoutReminders: false,
    mealReminders: false,
    progressUpdates: false,
    dailyTips: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/goals');
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <OnboardingLayout currentStep={6} totalSteps={8}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Stay Updated</h1>
        <p className="text-gray-400 mb-8">Choose how you want to receive notifications</p>

        <div className="space-y-4">
          <button
            onClick={() => togglePreference('workoutReminders')}
            className={`w-full p-6 rounded-xl flex items-center ${
              preferences.workoutReminders ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Bell size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Workout Reminders</h3>
              <p className="text-sm opacity-80">Get notified before scheduled workouts</p>
            </div>
          </button>

          <button
            onClick={() => togglePreference('mealReminders')}
            className={`w-full p-6 rounded-xl flex items-center ${
              preferences.mealReminders ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Clock size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Meal Reminders</h3>
              <p className="text-sm opacity-80">Notifications for meal prep and nutrition</p>
            </div>
          </button>

          <button
            onClick={() => togglePreference('progressUpdates')}
            className={`w-full p-6 rounded-xl flex items-center ${
              preferences.progressUpdates ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Activity size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Progress Updates</h3>
              <p className="text-sm opacity-80">Weekly progress and achievement notifications</p>
            </div>
          </button>

          <button
            onClick={() => togglePreference('dailyTips')}
            className={`w-full p-6 rounded-xl flex items-center ${
              preferences.dailyTips ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Calendar size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Daily Tips</h3>
              <p className="text-sm opacity-80">Receive daily fitness and nutrition tips</p>
            </div>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors mt-8"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}