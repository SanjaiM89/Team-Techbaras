import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Coffee, Pizza, X, Trophy, Edit2, Save, Plus, Check, RefreshCw, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Meal = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  completed: boolean;
};

type DayPlan = {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
};

function MealPrep() {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingMeal, setEditingMeal] = useState<{ day: number; meal: keyof DayPlan } | null>(null);
  const [preferences, setPreferences] = useState({
    calories: 2000,
    protein: 150,
    restrictions: [] as string[],
  });
  const [weeklyMeals, setWeeklyMeals] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [xpEarned, setXpEarned] = useState<number>(50);

  const [newMeal, setNewMeal] = useState<Meal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    completed: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token"); // Changed from "token" to "access_token"

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const api = axios.create({
    baseURL: "http://localhost:8000/api",
  });

  // Fetch meal plans and user XP on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.log("No access_token found, redirecting to login");
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const mealResponse = await api.get("/mealplans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWeeklyMeals(mealResponse.data || []);

        const userResponse = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserXp(userResponse.data.xp || 0);

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error) && error.response) {
          setError(`Failed to load data: ${error.response.data.detail || error.message}`);
          if (error.response.status === 401) {
            localStorage.removeItem("access_token"); // Changed from "token" to "access_token"
            navigate("/login");
          }
        } else {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/mealplans/${selectedDay}/${selectedMealType}`, newMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await api.get("/mealplans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyMeals(response.data);
      setShowAddMeal(false);
      setNewMeal({
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        completed: false
      });
    } catch (error) {
      console.error("Error adding meal:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to add meal: ${error.response.data.detail || error.message}`);
      } else {
        setError("Failed to add meal.");
      }
    }
  };

  const handleMealComplete = async (dayIndex: number, meal: keyof DayPlan, mealIndex: number) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const updatedMeal = { ...weeklyMeals[dayIndex][meal][mealIndex], completed: true };
    try {
      await api.put(`/mealplans/${dayIndex}/${meal}/${mealIndex}`, updatedMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mealResponse = await api.get("/mealplans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyMeals(mealResponse.data);

      const userResponse = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserXp(userResponse.data.xp || 0);

      setShowCompletionModal(true);
      setTimeout(() => setShowCompletionModal(false), 3000);
    } catch (error) {
      console.error("Error completing meal:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to complete meal: ${error.response.data.detail || error.message}`);
      } else {
        setError("Failed to complete meal.");
      }
    }
  };

  const handleMealDelete = async (dayIndex: number, meal: keyof DayPlan, mealIndex: number) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.delete(`/mealplans/${dayIndex}/${meal}/${mealIndex}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await api.get("/mealplans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyMeals(response.data);
      setError(null);
    } catch (error) {
      console.error("Error deleting meal:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to delete meal: ${error.response.data.detail || error.message}`);
      } else {
        setError("Failed to delete meal.");
      }
    }
  };

  const handleMealEdit = (dayIndex: number, meal: keyof DayPlan, mealIndex: number) => {
    setEditingMeal({ day: dayIndex, meal });
  };

  const handleMealUpdate = async (dayIndex: number, meal: keyof DayPlan, mealIndex: number, updatedMeal: Meal) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.put(`/mealplans/${dayIndex}/${meal}/${mealIndex}`, updatedMeal, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await api.get("/mealplans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyMeals(response.data);
      setEditingMeal(null);
    } catch (error) {
      console.error("Error updating meal:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to update meal: ${error.response.data.detail || error.message}`);
      } else {
        setError("Failed to update meal.");
      }
    }
  };

  const generateNewMealPlan = async () => {
    if (!token) {
      console.log("No access_token found, redirecting to login");
      navigate("/login");
      return;
    }
  
    console.log("Generating new meal plan for day:", selectedDay);
    console.log("Token:", token);
    setGenerateLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log("Request config:", config);
      const response = await api.post(
        `/mealplans/generate-day/${selectedDay}`,
        null,
        config
      );
      console.log("Generate response:", response.data);
  
      const mealResponse = await api.get("/mealplans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyMeals(mealResponse.data);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error generating meal plan:", error.response.status, error.response.data);
        const errorDetail = error.response.data.detail;
        if (Array.isArray(errorDetail)) {
          const errorMessages = errorDetail.map((e: any) => `${e.loc.join('.')}: ${e.msg}`).join(', ');
          setError(`Failed to generate meal plan: ${errorMessages}`);
        } else {
          setError(`Failed to generate meal plan: ${errorDetail || error.message}`);
        }
      } else {
        console.error("Error generating meal plan:", error);
        setError("Failed to generate meal plan: Unknown error");
      }
    } finally {
      setGenerateLoading(false);
    }
  };

  const MealCard = ({ meal, onComplete, onEdit, onDelete, index }: { meal: Meal; onComplete: () => void; onEdit: () => void; onDelete: () => void; index: number }) => (
    <div className="bg-dark-lighter rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{meal.name}</h4>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-primary hover:text-primary-dark">
            <Edit2 size={18} />
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            <Trash2 size={18} />
          </button>
          <button
            onClick={onComplete}
            className={`${meal.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
            disabled={meal.completed}
          >
            <Check size={18} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-sm text-gray-400">
        <div>
          <p className="font-medium">{meal.calories}</p>
          <p>cal</p>
        </div>
        <div>
          <p className="font-medium">{meal.protein}g</p>
          <p>protein</p>
        </div>
        <div>
          <p className="font-medium">{meal.carbs}g</p>
          <p>carbs</p>
        </div>
        <div>
          <p className="font-medium">{meal.fats}g</p>
          <p>fats</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 pb-24"
    >
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Meal Planning</h1>
        <p className="text-gray-400">Your personalized nutrition guide • Total XP: {userXp}</p>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Weekly Timeline</h2>
          <button
            onClick={generateNewMealPlan}
            disabled={generateLoading}
            className={`flex items-center bg-primary text-dark px-4 py-2 rounded-lg font-semibold ${generateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={18} className={`mr-2 ${generateLoading ? 'animate-spin' : ''}`} />
            {generateLoading ? "Generating..." : "Generate New Plan"}
          </button>
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedDay === index
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-gray-400'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading meal plans...</p>
        ) : weeklyMeals.length > 0 ? (
          <div className="bg-dark-light rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{days[selectedDay]}'s Meals</h3>
              <div className="flex items-center bg-dark-lighter px-3 py-1 rounded-lg">
                <Trophy className="text-yellow-500 mr-2" size={18} />
                <span className="text-sm">+50 XP per meal</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Coffee className="text-primary mr-2" size={20} />
                    <h4 className="font-medium">Breakfast</h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMealType('breakfast');
                      setShowAddMeal(true);
                    }}
                    className="bg-dark-lighter p-2 rounded-full"
                  >
                    <Plus size={18} className="text-primary" />
                  </button>
                </div>
                {weeklyMeals[selectedDay]?.breakfast.map((meal, index) => (
                  <MealCard
                    key={index}
                    meal={meal}
                    index={index}
                    onComplete={() => handleMealComplete(selectedDay, 'breakfast', index)}
                    onEdit={() => handleMealEdit(selectedDay, 'breakfast', index)}
                    onDelete={() => handleMealDelete(selectedDay, 'breakfast', index)}
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Apple className="text-primary mr-2" size={20} />
                    <h4 className="font-medium">Lunch</h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMealType('lunch');
                      setShowAddMeal(true);
                    }}
                    className="bg-dark-lighter p-2 rounded-full"
                  >
                    <Plus size={18} className="text-primary" />
                  </button>
                </div>
                {weeklyMeals[selectedDay]?.lunch.map((meal, index) => (
                  <MealCard
                    key={index}
                    meal={meal}
                    index={index}
                    onComplete={() => handleMealComplete(selectedDay, 'lunch', index)}
                    onEdit={() => handleMealEdit(selectedDay, 'lunch', index)}
                    onDelete={() => handleMealDelete(selectedDay, 'lunch', index)}
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Pizza className="text-primary mr-2" size={20} />
                    <h4 className="font-medium">Dinner</h4>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMealType('dinner');
                      setShowAddMeal(true);
                    }}
                    className="bg-dark-lighter p-2 rounded-full"
                  >
                    <Plus size={18} className="text-primary" />
                  </button>
                </div>
                {weeklyMeals[selectedDay]?.dinner.map((meal, index) => (
                  <MealCard
                    key={index}
                    meal={meal}
                    index={index}
                    onComplete={() => handleMealComplete(selectedDay, 'dinner', index)}
                    onEdit={() => handleMealEdit(selectedDay, 'dinner', index)}
                    onDelete={() => handleMealDelete(selectedDay, 'dinner', index)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No meal plans available. Generate a new plan to get started!</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Nutrition Overview</h2>
        <div className="bg-dark-light rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Daily Target</p>
              <p className="text-xl font-bold text-primary">{preferences.calories} cal</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Protein Goal</p>
              <p className="text-xl font-bold text-primary">{preferences.protein}g</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Meals Completed</p>
              <p className="text-xl font-bold text-green-500">
                {weeklyMeals.length > 0
                  ? weeklyMeals[selectedDay]?.breakfast.filter(m => m.completed).length +
                    weeklyMeals[selectedDay]?.lunch.filter(m => m.completed).length +
                    weeklyMeals[selectedDay]?.dinner.filter(m => m.completed).length
                  : 0}/
                {weeklyMeals.length > 0
                  ? weeklyMeals[selectedDay]?.breakfast.length +
                    weeklyMeals[selectedDay]?.lunch.length +
                    weeklyMeals[selectedDay]?.dinner.length
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Meal</h2>
                <button onClick={() => setShowAddMeal(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Calories</label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Protein (g)</label>
                    <input
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Carbs (g)</label>
                    <input
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fats (g)</label>
                    <input
                      type="number"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-dark font-semibold py-3 rounded-lg flex items-center justify-center"
                >
                  <Save className="mr-2" size={20} />
                  Add Meal
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-dark px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <Trophy className="mr-2" />
              <p className="font-semibold">Great job! +{xpEarned} XP earned! Total XP: {userXp}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default MealPrep;