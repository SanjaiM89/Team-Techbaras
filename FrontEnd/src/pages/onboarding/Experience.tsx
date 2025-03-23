import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Dumbbell, Brain } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function Experience() {
  const navigate = useNavigate();
  const [experience, setExperience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/assistance');
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Your Experience Level</h1>
        <p className="text-gray-400 mb-8">Tell us about your fitness journey</p>

        <div className="space-y-4">
          <button
            onClick={() => setExperience('beginner')}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === 'beginner' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Star size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Beginner</h3>
              <p className="text-sm opacity-80">New to fitness or returning after a long break</p>
            </div>
          </button>

          <button
            onClick={() => setExperience('intermediate')}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === 'intermediate' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Dumbbell size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Intermediate</h3>
              <p className="text-sm opacity-80">Regular workouts with some experience</p>
            </div>
          </button>

          <button
            onClick={() => setExperience('advanced')}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === 'advanced' ? 'bg-primary text-dark' : 'bg-dark-lighter'
            }`}
          >
            <Brain size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Advanced</h3>
              <p className="text-sm opacity-80">Experienced with proper form and techniques</p>
            </div>
          </button>
        </div>

        {experience && (
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