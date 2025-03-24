import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Home, Dumbbell, Clock, Target } from 'lucide-react';

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Changed from "token" to "access_token"
    if (!token) {
      console.log("No access_token found, redirecting to login");
      navigate("/login"); // Redirect to login instead of signup
    }
  }, [navigate]);

  const steps = [
    {
      title: "Welcome to AI Fitness",
      description: "Let's personalize your fitness journey",
      icon: <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Dumbbell className="w-16 h-16 text-primary" />
      </motion.div>
    },
    {
      title: "Where do you work out?",
      description: "Choose your preferred workout location",
      options: [
        { icon: <Home />, label: "Home" },
        { icon: <Dumbbell />, label: "Gym" }
      ]
    },
    {
      title: "Weekly Commitment",
      description: "How many hours can you dedicate per week?",
      options: [
        { icon: <Clock />, label: "2-3 hours" },
        { icon: <Clock />, label: "4-5 hours" },
        { icon: <Clock />, label: "6+ hours" }
      ]
    },
    {
      title: "Your Goal",
      description: "What's your primary fitness goal?",
      options: [
        { icon: <Target />, label: "Weight Loss" },
        { icon: <Target />, label: "Muscle Gain" },
        { icon: <Target />, label: "Overall Fitness" }
      ]
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/onboarding/user-details'); // Redirect to the actual onboarding start
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex-1 p-6"
      >
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1">
            <div className="mb-8">
              {steps[step].icon}
              <h1 className="text-2xl font-bold mt-6 mb-2">{steps[step].title}</h1>
              <p className="text-gray-400">{steps[step].description}</p>
            </div>

            {steps[step].options && (
              <div className="space-y-4">
                {steps[step].options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full bg-dark-light hover:bg-dark-lighter transition-colors p-4 rounded-xl flex items-center justify-between"
                    onClick={handleNext}
                  >
                    <div className="flex items-center">
                      <span className="text-primary mr-3">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {!steps[step].options && (
            <button
              onClick={handleNext}
              className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </motion.div>

      <div className="p-6">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index <= step ? 'bg-primary' : 'bg-dark-light'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;