import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Ruler, Calculator } from "lucide-react";
import OnboardingLayout from "../../components/onboarding/OnboardingLayout";

export default function BodyMetrics() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    height: "",
    weight: "",
    unit: "metric", // "metric" (cm/kg) or "imperial" (in/lbs)
  });

  const [bmi, setBmi] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing body metrics if available
  useEffect(() => {
    const fetchBodyMetrics = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/onboarding/get-body-metrics",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch body metrics");

        const data = await response.json();
        setMetrics({
          height: data.height.toString(),
          weight: data.weight.toString(),
          unit: data.unit,
        });
        setBmi(data.bmi?.toString() || null);
      } catch (err) {
        console.error("Error fetching body metrics:", err);
      }
    };

    fetchBodyMetrics();
  }, []);

  // Calculate BMI based on selected unit
  const calculateBMI = () => {
    if (!metrics.height || !metrics.weight) return null;

    let calculatedBmi: number;
    if (metrics.unit === "metric") {
      const heightInM = parseFloat(metrics.height) / 100;
      calculatedBmi = parseFloat(metrics.weight) / (heightInM * heightInM);
    } else {
      calculatedBmi =
        (parseFloat(metrics.weight) * 703) /
        (parseFloat(metrics.height) * parseFloat(metrics.height));
    }
    return calculatedBmi.toFixed(1);
  };

  // Handle form submission and send data to FastAPI backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const calculatedBmi = calculateBMI();

    try {
      const response = await fetch(
        "http://localhost:8000/onboarding/save-body-metrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            height: parseFloat(metrics.height),
            weight: parseFloat(metrics.weight),
            unit: metrics.unit,
            bmi: calculatedBmi ? parseFloat(calculatedBmi) : undefined,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to save metrics");

      console.log("Body metrics saved:", data);
      navigate("/onboarding/experience");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={7}>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">Body Metrics</h1>
        <p className="text-gray-400 mb-8">
          Help us calculate your BMI and personalize your plan
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unit Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setMetrics({ ...metrics, unit: "metric" })}
              className={`px-6 py-2 rounded-lg ${
                metrics.unit === "metric"
                  ? "bg-primary text-dark"
                  : "bg-dark-lighter"
              }`}
            >
              Metric
            </button>
            <button
              type="button"
              onClick={() => setMetrics({ ...metrics, unit: "imperial" })}
              className={`px-6 py-2 rounded-lg ${
                metrics.unit === "imperial"
                  ? "bg-primary text-dark"
                  : "bg-dark-lighter"
              }`}
            >
              Imperial
            </button>
          </div>

          {/* Height Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Height</label>
            <div className="relative">
              <Ruler
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                value={metrics.height}
                onChange={(e) =>
                  setMetrics({ ...metrics, height: e.target.value })
                }
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={metrics.unit === "metric" ? "Height in cm" : "Height in inches"}
                required
              />
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Weight</label>
            <div className="relative">
              <Scale
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                value={metrics.weight}
                onChange={(e) =>
                  setMetrics({ ...metrics, weight: e.target.value })
                }
                className="w-full bg-dark-lighter text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={metrics.unit === "metric" ? "Weight in kg" : "Weight in lbs"}
                required
              />
            </div>
          </div>

          {/* BMI Calculation Display */}
          {metrics.height && metrics.weight && (
            <div className="bg-dark-lighter p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Calculator className="text-primary mr-3" size={24} />
                <h3 className="text-lg font-semibold">Your BMI</h3>
              </div>
              <p className="text-3xl font-bold text-primary">{calculateBMI()}</p>
              <p className="text-gray-400 mt-2">
                {parseFloat(calculateBMI()!) < 18.5
                  ? "Underweight"
                  : parseFloat(calculateBMI()!) < 25
                  ? "Normal weight"
                  : parseFloat(calculateBMI()!) < 30
                  ? "Overweight"
                  : "Obese"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-dark font-semibold py-4 rounded-xl transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
}
