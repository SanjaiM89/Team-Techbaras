import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, Dumbbell } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function FitnessProfile() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/body-metrics');
  };

  return (
    <OnboardingLayout currentStep={1} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Where do you work out?</h1>
        <p className="text-gray-400 mb-8">We'll customize your workouts based on your location</p>

        <div className="space-y-4">
          <button
            onClick={() => setLocation('home')}
            className={`w-full p-6 rounded-xl flex items-center ${
              location === 'home' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Home size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Home Workouts</h3>
              <p className="text-sm opacity-80">Minimal equipment needed</p>
            </div>
          </button>

          <button
            onClick={() => setLocation('gym')}
            className={`w-full p-6 rounded-xl flex items-center ${
              location === 'gym' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Building2 size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Gym</h3>
              <p className="text-sm opacity-80">Full equipment access</p>
            </div>
          </button>

          <button
            onClick={() => setLocation('both')}
            className={`w-full p-6 rounded-xl flex items-center ${
              location === 'both' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Dumbbell size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Both</h3>
              <p className="text-sm opacity-80">Mix of home and gym workouts</p>
            </div>
          </button>
        </div>

        {location && (
          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors mt-8"
          >
            Continue
          </button>
        )}
      </div>
    </OnboardingLayout>
  );
}