import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";
import axios from "axios";

export default function Photo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(
          "http://localhost:8000/onboarding/upload-progress-photo",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setPhoto(response.data.photo_url);
      } catch (err) {
        setError("Failed to upload. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
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
                src={`http://localhost:8000/static/${photo}`}
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
              {loading ? (
                <Loader2 size={48} className="text-gray-400 animate-spin" />
              ) : (
                <>
                  <Camera size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-400">Click to add a photo</p>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG • Max 10MB</p>
                </>
              )}
            </button>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
            {photo ? "Complete Setup" : "Skip for Now"}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
