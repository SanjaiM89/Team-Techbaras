import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Dumbbell, Brain } from "lucide-react";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";

export default function Experience() {
  const navigate = useNavigate();
  const [experience, setExperience] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing experience level if available
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/onboarding/get-experience",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch experience level");

        const data = await response.json();
        setExperience(data.experience);
      } catch (err) {
        console.error("Error fetching experience level:", err);
      }
    };

    fetchExperience();
  }, []);

  // Handle form submission and send data to FastAPI backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/onboarding/save-experience",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ experience }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to save experience");

      console.log("Experience level saved:", data);
      navigate("/onboarding/assistance");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Your Experience Level</h1>
        <p className="text-gray-400 mb-8">Tell us about your fitness journey</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <button
            onClick={() => setExperience("beginner")}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === "beginner" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Star size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Beginner</h3>
              <p className="text-sm opacity-80">New to fitness or returning after a long break</p>
            </div>
          </button>

          <button
            onClick={() => setExperience("intermediate")}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === "intermediate" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Dumbbell size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Intermediate</h3>
              <p className="text-sm opacity-80">Regular workouts with some experience</p>
            </div>
          </button>

          <button
            onClick={() => setExperience("advanced")}
            className={`w-full p-6 rounded-xl flex items-center ${
              experience === "advanced" ? "bg-primary text-dark" : "bg-dark-lighter"
            }`}
          >
            <Brain size={24} className="mr-4" />
            <div className="text-left">
              <h3 className="font-semibold">Advanced</h3>
              <p className="text-sm opacity-80">Experienced with proper form and techniques</p>
            </div>
          </button>
        </div>

        {experience && (
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
