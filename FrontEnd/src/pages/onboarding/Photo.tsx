import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X } from 'lucide-react';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

export default function Photo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save photo if provided
    navigate('/');
  };

  return (
    <OnboardingLayout currentStep={7} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Progress Photo</h1>
        <p className="text-gray-400 mb-8">Track your transformation (optional)</p>

        <div className="space-y-6">
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt="Progress"
                className="w-full h-96 object-cover rounded-xl"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-4 right-4 bg-dark-lighter p-2 rounded-full"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-96 bg-dark-lighter rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-primary transition-colors"
            >
              <Camera size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-400">Click to add a photo</p>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG • Max 10MB</p>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors"
          >
            {photo ? 'Complete Setup' : 'Skip for Now'}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}