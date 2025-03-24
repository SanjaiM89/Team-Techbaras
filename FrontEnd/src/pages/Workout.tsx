import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Heart, Brain, Bone, ChevronRight, Plus, X, Save, RefreshCw, Trash2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  weight: number;
  duration: number;
  description: string;
  restTime: number;
  xp: number;
};

type Workout = {
  _id: string;
  title: string;
  type: string;
  duration: number;
  intensity: string;
  description: string;
  xp: number;
  exercises: Exercise[];
  user_id: string;
  completed: boolean;
};

type JwtPayload = {
  user_id: string;
  exp: number;
};

function Workout() {
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState<number | null>(null);
  const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<JwtPayload>(token).user_id : null;

  const [newWorkout, setNewWorkout] = useState<Workout>({
    _id: "",
    title: "",
    type: "strength",
    duration: 30,
    intensity: "Medium",
    description: "",
    xp: 200,
    exercises: [],
    user_id: userId || "",
    completed: false,
  });

  const getDefaultXP = (type: string): number => {
    switch (type) {
      case "strength":
        return 50;
      case "cardio":
        return 40;
      case "recovery":
        return 30;
      default:
        return 30;
    }
  };

  const [newExercise, setNewExercise] = useState<Exercise>({
    name: "",
    sets: 3,
    reps: "10-12",
    weight: 0,
    duration: 0,
    description: "",
    restTime: 60,
    xp: getDefaultXP("strength"),
  });

  const api = axios.create({
    baseURL: "http://localhost:8000/workouts",
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched workouts:", response.data);
        // Log and filter out workouts without an _id
        response.data.forEach((workout: Workout, index: number) => {
          if (!workout._id) {
            console.error(`Workout at index ${index} is missing _id:`, workout);
          }
        });
        const validWorkouts = response.data.filter((workout: Workout) => workout._id && typeof workout._id === "string");
        console.log("Valid workouts after filtering:", validWorkouts);
        setCustomWorkouts(validWorkouts);
        setError(null);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to load workouts. Please try again.");
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchWorkouts();
  }, [token, navigate]);

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/workouts", newWorkout, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Add workout response:", response.data);
      if (!response.data.workout_id || typeof response.data.workout_id !== "string") {
        console.error("Backend response missing or invalid workout_id:", response.data);
        setError("Failed to add workout: Missing or invalid workout ID from server.");
        return;
      }
      const workoutIndex = customWorkouts.length;
      const newWorkoutWithId = { ...newWorkout, _id: response.data.workout_id, completed: false };
      console.log("Added workout:", newWorkoutWithId);
      setCustomWorkouts([...customWorkouts, newWorkoutWithId]);
      setShowAddWorkout(false);
      setSelectedWorkoutIndex(workoutIndex);
      setShowAddExercise(true);
      setNewWorkout({
        _id: "",
        title: "",
        type: "strength",
        duration: 30,
        intensity: "Medium",
        description: "",
        xp: 200,
        exercises: [],
        user_id: userId || "",
        completed: false,
      });
      setError(null);
    } catch (error) {
      console.error("Error adding workout:", error);
      setError("Failed to add workout. Please try again.");
    }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorkoutIndex === null || !token) {
      if (!token) navigate("/login");
      return;
    }

    const updatedWorkouts = [...customWorkouts];
    const exerciseWithXP = {
      ...newExercise,
      xp: getDefaultXP(updatedWorkouts[selectedWorkoutIndex].type),
    };
    updatedWorkouts[selectedWorkoutIndex].exercises.push(exerciseWithXP);

    try {
      await api.put(`/workouts/${updatedWorkouts[selectedWorkoutIndex]._id}`, updatedWorkouts[selectedWorkoutIndex], {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomWorkouts(updatedWorkouts);
      setNewExercise({
        name: "",
        sets: 3,
        reps: "10-12",
        weight: 0,
        duration: 0,
        description: "",
        restTime: 60,
        xp: getDefaultXP("strength"),
      });
      setError(null);
    } catch (error) {
      console.error("Error adding exercise:", error);
      setError("Failed to add exercise. Please try again.");
    }
  };

  const handleFinishAddingExercises = () => {
    setShowAddExercise(false);
    setSelectedWorkoutIndex(null);
  };

  const handleGenerateWorkout = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/generate-workout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const generatedWorkout = response.data;
      console.log("Generated workout:", generatedWorkout);
      if (!generatedWorkout._id || typeof generatedWorkout._id !== "string") {
        console.error("Generated workout is missing or invalid _id:", generatedWorkout);
        setError("Failed to generate workout: Missing or invalid workout ID from server.");
        return;
      }
      setCustomWorkouts([...customWorkouts, generatedWorkout]);
      setSelectedWorkoutIndex(customWorkouts.length);
      setShowWorkoutDetails(true);
      setError(null);
    } catch (error) {
      console.error("Error generating workout:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || "Failed to generate workout. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: string, index: number) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!workoutId || typeof workoutId !== "string") {
      console.error("Delete workout failed: Invalid workout ID", workoutId);
      setError("Cannot delete workout: Invalid workout ID.");
      return;
    }

    console.log(`Deleting workout with ID: ${workoutId} at index: ${index}`);
    try {
      const response = await api.delete(`/workouts/${workoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete response:", response.data);
      const updatedWorkouts = customWorkouts.filter((_, i) => i !== index);
      console.log("Updated workouts after deletion:", updatedWorkouts);
      setCustomWorkouts(updatedWorkouts);
      setError(null);
      if (selectedWorkoutIndex === index) {
        setShowWorkoutDetails(false);
        setSelectedWorkoutIndex(null);
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || "Failed to delete workout. Please try again.");
      } else {
        setError("An unexpected error occurred while deleting the workout.");
      }
    }
  };

  const handleCompleteWorkout = async (workoutId: string, index: number) => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!workoutId || typeof workoutId !== "string") {
      console.error("Complete workout failed: Invalid workout ID", workoutId);
      setError("Cannot complete workout: Invalid workout ID.");
      return;
    }

    console.log(`Completing workout with ID: ${workoutId} at index: ${index}`);
    try {
      const response = await api.post(`/workouts/${workoutId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Complete response:", response.data);
      const updatedWorkouts = customWorkouts.filter((_, i) => i !== index);
      console.log("Updated workouts after completion:", updatedWorkouts);
      setCustomWorkouts(updatedWorkouts);
      setCompletionMessage(`Workout completed! You earned ${response.data.xp_added} XP. Total XP: ${response.data.total_xp}`);
      setTimeout(() => setCompletionMessage(null), 3000);
      setError(null);
      if (selectedWorkoutIndex === index) {
        setShowWorkoutDetails(false);
        setSelectedWorkoutIndex(null);
      }
    } catch (error) {
      console.error("Error completing workout:", error);
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || "Failed to complete workout. Please try again.");
      } else {
        setError("An unexpected error occurred while completing the workout.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 pb-24"
    >
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Workouts</h1>
            <p className="text-gray-400">Choose your training focus</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateWorkout}
              className="bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
              disabled={isGenerating}
            >
              <RefreshCw className={`mr-2 size-16 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating..." : "Generate Workout"}
            </button>
            <button
              onClick={() => setShowAddWorkout(true)}
              className="bg-primary text-dark p-3 rounded-full"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {completionMessage && (
        <p className="text-green-500 mb-4 animate-pulse">{completionMessage}</p>
      )}

      <div className="space-y-4">
        <Link to="/workout/strength" className="block">
          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Dumbbell className="text-primary mr-3" size={24} />
              <h2 className="text-xl font-semibold">Weight Training</h2>
            </div>
            <p className="text-gray-400 mb-4">Build strength and muscle with AI form guidance</p>
            <div className="flex justify-between items-center">
              <span className="text-primary">+300 XP per session</span>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>

        <Link to="/workout/cardio" className="block">
          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Heart className="text-red-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Cardio</h2>
            </div>
            <p className="text-gray-400 mb-4">Improve endurance and heart health</p>
            <div className="flex justify-between items-center">
              <span className="text-primary">+250 XP per session</span>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>

        <Link to="/workout/recovery" className="block">
          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Brain className="text-purple-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Recovery</h2>
            </div>
            <p className="text-gray-400 mb-4">Stretching and mobility exercises</p>
            <div className="flex justify-between items-center">
              <span className="text-primary">+150 XP per session</span>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>

        <Link to="/workout/physiotherapy" className="block">
          <div className="bg-dark-light rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Bone className="text-green-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Physiotherapy</h2>
            </div>
            <p className="text-gray-400 mb-4">Rehabilitation and pain relief exercises</p>
            <div className="flex justify-between items-center">
              <span className="text-primary">+100 XP per session</span>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </Link>

        {customWorkouts.map((workout, index) => {
          const isValidWorkout = workout._id && typeof workout._id === "string";
          if (!isValidWorkout) {
            console.warn(`Skipping rendering of invalid workout at index ${index}:`, workout);
          }
          return isValidWorkout ? (
            <div key={workout._id} className="block">
              <div className="bg-dark-light rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {workout.type === "strength" && <Dumbbell className="text-primary mr-3" size={24} />}
                  {workout.type === "cardio" && <Heart className="text-red-500 mr-3" size={24} />}
                  {workout.type === "recovery" && <Brain className="text-purple-500 mr-3" size={24} />}
                  <h2 className="text-xl font-semibold flex-1">{workout.title}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isValidWorkout) return;
                        handleCompleteWorkout(workout._id, index);
                      }}
                      className={`p-1 ${workout.completed ? "text-green-500 cursor-not-allowed" : "text-gray-400 hover:text-green-500"}`}
                      disabled={workout.completed || !isValidWorkout}
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isValidWorkout) return;
                        handleDeleteWorkout(workout._id, index);
                      }}
                      className={`p-1 ${!isValidWorkout ? "text-gray-400 cursor-not-allowed" : "text-gray-400 hover:text-red-500"}`}
                      disabled={!isValidWorkout}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{workout.description}</p>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => {
                    setSelectedWorkoutIndex(index);
                    setShowWorkoutDetails(true);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-primary">+{workout.xp} XP per session</span>
                    <span className="text-gray-400">{workout.duration} mins</span>
                    <span className="text-gray-400">{workout.intensity}</span>
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showAddWorkout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add Custom Workout</h2>
                <button onClick={() => setShowAddWorkout(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddWorkout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Workout Title</label>
                  <input
                    type="text"
                    value={newWorkout.title}
                    onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newWorkout.duration}
                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    min="5"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Intensity</label>
                  <select
                    value={newWorkout.intensity}
                    onChange={(e) => setNewWorkout({ ...newWorkout, intensity: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    rows={3}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-dark font-semibold py-3 rounded-lg flex items-center justify-center"
                >
                  <Save className="mr-2" size={20} />
                  Continue to Add Exercises
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Exercise Modal */}
      <AnimatePresence>
        {showAddExercise && selectedWorkoutIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Add Exercise</h2>
                  <p className="text-sm text-gray-400">
                    {customWorkouts[selectedWorkoutIndex].exercises.length} exercises added
                  </p>
                </div>
                <button onClick={handleFinishAddingExercises}>
                  <X className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddExercise} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Name</label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sets</label>
                    <input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reps</label>
                    <input
                      type="text"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      placeholder="e.g., 10-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                    <input
                      type="number"
                      value={newExercise.duration}
                      onChange={(e) => setNewExercise({ ...newExercise, duration: parseInt(e.target.value) || 0 })}
                      className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Rest Time (seconds)</label>
                  <input
                    type="number"
                    value={newExercise.restTime}
                    onChange={(e) => setNewExercise({ ...newExercise, restTime: parseInt(e.target.value) || 0 })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newExercise.description}
                    onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2 text-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-dark font-semibold py-3 rounded-lg flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={20} />
                    Add Another Exercise
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishAddingExercises}
                    className="flex-1 bg-dark-lighter text-white font-semibold py-3 rounded-lg flex items-center justify-center"
                  >
                    <Save className="mr-2" size={20} />
                    Finish
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Details Modal */}
      <AnimatePresence>
        {showWorkoutDetails && selectedWorkoutIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-dark-light rounded-xl w-full max-w-md p-6 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{customWorkouts[selectedWorkoutIndex].title}</h2>
                <button onClick={() => setShowWorkoutDetails(false)}>
                  <X className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {customWorkouts[selectedWorkoutIndex].exercises.map((exercise, index) => (
                  <div key={index} className="bg-dark-lighter rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <span className="text-primary">+{exercise.xp} XP</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{exercise.description}</p>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Sets</p>
                        <p className="font-medium">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Reps</p>
                        <p className="font-medium">{exercise.reps || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Weight</p>
                        <p className="font-medium">{exercise.weight ? `${exercise.weight}kg` : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Rest</p>
                        <p className="font-medium">{exercise.restTime}s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowWorkoutDetails(false);
                  setShowAddExercise(true);
                }}
                className="w-full bg-primary text-dark font-semibold py-3 rounded-lg flex items-center justify-center mt-4"
              >
                <Plus className="mr-2" size={20} />
                Add Exercise
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Workout;