import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function UserDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save user details
    navigate('/onboarding/fitness-profile');
  };

  return (
    <OnboardingLayout currentStep={0} totalSteps={7} showBackButton={false}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
        <p className="text-gray-400 mb-8">Help us personalize your experience</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <div className="grid grid-cols-3 gap-4">
              {['Male', 'Female', 'Other'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender })}
                  className={`p-3 rounded-xl ${
                    formData.gender === gender ? 'bg-primary text-dark' : 'bg-dark-lighter text-white'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
}