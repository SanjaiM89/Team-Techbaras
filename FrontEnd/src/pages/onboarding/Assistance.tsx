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

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/onboarding/save-assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assistance }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save assistance level");
      }

      navigate("/onboarding/schedule");
    } catch (err) {
      setError(err.message);
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
          {[
            { level: "light", icon: <Feather size={24} />, title: "Light Assistance", desc: "Basic guidance and form checks" },
            { level: "moderate", icon: <Shield size={24} />, title: "Moderate Assistance", desc: "Regular check-ins and detailed form guidance" },
            { level: "heavy", icon: <Zap size={24} />, title: "Heavy Assistance", desc: "Step-by-step guidance and constant support" },
          ].map(({ level, icon, title, desc }) => (
            <button
              key={level}
              onClick={() => setAssistance(level)}
              className={`w-full p-6 rounded-xl flex items-center ${assistance === level ? "bg-primary text-dark" : "bg-dark-lighter"}`}
            >
              {icon}
              <div className="text-left ml-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm opacity-80">{desc}</p>
              </div>
            </button>
          ))}
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
