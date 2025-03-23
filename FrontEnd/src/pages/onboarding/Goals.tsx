import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Scale, Heart, Dumbbell, Brain } from 'lucide-react';
import axios from 'axios';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function Goals() {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goals = [
    { id: 'weight-loss', icon: Scale, title: 'Weight Loss', description: 'Burn fat and get lean' },
    { id: 'muscle-gain', icon: Dumbbell, title: 'Build Muscle', description: 'Gain strength and size' },
    { id: 'endurance', icon: Heart, title: 'Improve Endurance', description: 'Better stamina and health' },
    { id: 'flexibility', icon: Brain, title: 'Increase Flexibility', description: 'Better mobility and balance' }
  ];

  // Fetch saved goals from FastAPI
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/onboarding/get-goals", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedGoals(response.data.goals);
      } catch (err) {
        setError("Failed to load goals.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Toggle goal selection
  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  // Save selected goals to FastAPI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/onboarding/save-goals", 
        { goals: selectedGoals }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/onboarding/photo');
    } catch (err) {
      setError("Failed to save goals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={6} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Your Fitness Goals</h1>
        <p className="text-gray-400 mb-8">Select all that apply</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 gap-4 mb-8">
          {goals.map(({ id, icon: Icon, title, description }) => (
            <button
              key={id}
              onClick={() => toggleGoal(id)}
              className={`p-6 rounded-xl flex flex-col items-center text-center ${
                selectedGoals.includes(id) ? 'bg-primary text-dark' : 'bg-dark-lighter'
              }`}
            >
              <Icon size={32} className="mb-4" />
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm opacity-80">{description}</p>
            </button>
          ))}
        </div>

        {selectedGoals.length > 0 && (
          <div className="space-y-4">
            <div className="bg-dark-lighter p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Target className="text-primary mr-3" />
                <h3 className="font-semibold">Selected Goals</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedGoals.map(goalId => (
                  <span
                    key={goalId}
                    className="bg-dark px-3 py-1 rounded-full text-sm"
                  >
                    {goals.find(g => g.id === goalId)?.title}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
