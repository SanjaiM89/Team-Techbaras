import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type OnboardingLayoutProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  showBackButton?: boolean;
};

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true
}: OnboardingLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex-1 p-6"
      >
        <div className="h-full flex flex-col">
          {showBackButton && (
            <button
              onClick={onBack || (() => navigate(-1))}
              className="mb-6 text-gray-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {children}
        </div>
      </motion.div>

      <div className="p-6">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-dark-light'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}