import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function UserDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication error. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:8000/onboarding/save-user-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.detail || "Failed to save user details");
        return;
      }

      // Navigate to the next step
      navigate("/onboarding/fitness-profile");
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <OnboardingLayout currentStep={0} totalSteps={7} showBackButton={false}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
        <p className="text-gray-400 mb-8">Help us personalize your experience</p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your Full Name"
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
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
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
                  onClick={() => setFormData((prev) => ({ ...prev, gender }))}
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
