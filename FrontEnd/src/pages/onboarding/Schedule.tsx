import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function Schedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({
    daysPerWeek: 0,
    timePerSession: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      const response = await fetch("http://localhost:8000/onboarding/save-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(schedule),
      });
  
      if (response.ok) {
        navigate("/onboarding/goals");
      } else {
        console.error("Failed to save schedule");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <OnboardingLayout currentStep={5} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Your Schedule</h1>
        <p className="text-gray-400 mb-8">Let's plan your workout routine</p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-4">Days per week</label>
            <div className="grid grid-cols-4 gap-4">
              {[2, 3, 4, 5, 6, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSchedule({ ...schedule, daysPerWeek: days })}
                  className={`p-4 rounded-xl flex flex-col items-center ${
                    schedule.daysPerWeek === days ? 'bg-primary text-dark' : 'bg-dark-lighter'
                  }`}
                >
                  <Calendar size={20} className="mb-2" />
                  <span>{days}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">Time per session</label>
            <div className="grid grid-cols-2 gap-4">
              {['30 mins', '45 mins', '60 mins', '90 mins'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSchedule({ ...schedule, timePerSession: time })}
                  className={`p-4 rounded-xl flex items-center justify-center ${
                    schedule.timePerSession === time ? 'bg-primary text-dark' : 'bg-dark-lighter'
                  }`}
                >
                  <Clock size={20} className="mr-2" />
                  <span>{time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {schedule.daysPerWeek > 0 && schedule.timePerSession && (
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