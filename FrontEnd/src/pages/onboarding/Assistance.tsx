import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Feather, Shield, Zap } from "lucide-react";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";

export default function Assistance() {
  const navigate = useNavigate();
  const [assistance, setAssistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token"); // Get JWT from local storage
      const response = await fetch("http://localhost:8000/save-assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send JWT token for authentication
        },
        body: JSON.stringify({ assistance }),
      });

      if (!response.ok) {
        throw new Error("Failed to save assistance level");
      }

      // Navigate to the next step on success
      navigate("/onboarding/schedule");
    } catch (err) {
      setError("Error saving assistance level. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Preferred Assistance Level</h1>
        <p className="text-gray-400 mb-8">How much guidance do you need?</p>

        <div className="space-y-4">
          <button
            onClick={() => setAssistance("light")}
            className={`w-full p-6 rounded-xl flex items-center ${
              assistance === "light" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Feather size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Light Assistance</h3>
              <p className="text-sm opacity-80">Basic guidance and form checks</p>
            </div>
          </button>

          <button
            onClick={() => setAssistance("moderate")}
            className={`w-full p-6 rounded-xl flex items-center ${
              assistance === "moderate" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Shield size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Moderate Assistance</h3>
              <p className="text-sm opacity-80">
                Regular check-ins and detailed form guidance
              </p>
            </div>
          </button>

          <button
            onClick={() => setAssistance("heavy")}
            className={`w-full p-6 rounded-xl flex items-center ${
              assistance === "heavy" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Zap size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Heavy Assistance</h3>
              <p className="text-sm opacity-80">
                Step-by-step guidance and constant support
              </p>
            </div>
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {assistance && (
          <button
            onClick={handleSubmit}
            className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors mt-8"
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        )}
      </div>
    </OnboardingLayout>
  );
}
