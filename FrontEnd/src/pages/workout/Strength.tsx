import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, ChevronLeft, Play, Camera, Timer as TimerIcon, CheckCircle, Trash2, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function StrengthWorkout() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([
    {
      name: "Squats",
      sets: 5,
      reps: "8-10",
      xp: 80,
      form: "Keep your chest up, back straight, and knees aligned with your toes.",
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742709640/squat_xwuyrm.gif",
      progress: {
        weights: [140, 150, 160, 170, 180, 190],
        dates: ["Tue", "Thu", "Sat", "Tue", "Thu", "Sat"]
      },
      completed: false // Added completed field
    },
    {
      name: "Shoulder Press",
      sets: 3,
      reps: "12-15",
      xp: 60,
      form: "Keep core tight, avoid arching your back.",
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742712040/shoulderpress_rmdfr1.gif",
      progress: {
        weights: [85, 90, 95, 100, 105, 110],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Lat Pulldowns",
      sets: 4,
      reps: "12-15",
      xp: 65,
      form: "Pull the bar to your upper chest, squeeze your lats.",
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742712164/latpulldown_xuhlzo.gif",
      progress: {
        weights: [120, 130, 140, 150, 160, 170],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Bicep Curls",
      sets: 3,
      reps: "12-15",
      xp: 50,
      form: "Keep elbows fixed, avoid swinging.",
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742712265/bicepcurl_f1snmq.gif",
      progress: {
        weights: [30, 35, 35, 40, 40, 45],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    }
  ]);
  const [showCompletionModal, setShowCompletionModal] = useState(false); // State for success modal
  const [xpEarned, setXpEarned] = useState<number>(0); // State for XP earned

  const handleCustomization = (options: any) => {
    console.log('Updated workout settings:', options);
  };

  const handleTimerComplete = () => {
    console.log('Timer completed!');
  };

  const handleCompleteExercise = (index: number) => {
    const updatedExercises = [...exercises];
    if (!updatedExercises[index].completed) {
      updatedExercises[index].completed = true;
      setExercises(updatedExercises);
      setXpEarned(updatedExercises[index].xp); // Set XP for the modal
      setShowCompletionModal(true);
      setTimeout(() => setShowCompletionModal(false), 3000); // Hide modal after 3 seconds
    }
  };

  const handleDeleteExercise = (index: number) => {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
    if (currentExercise === index) {
      setCurrentExercise(0); // Reset to first exercise if deleted one was selected
    } else if (currentExercise > index) {
      setCurrentExercise(currentExercise - 1); // Adjust index if deleted exercise was before selected
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to="/workout" className="mr-4">
              <ChevronLeft className="text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Upper Body Strength</h1>
              <p className="text-gray-400">45 mins • +300 XP</p>
            </div>
          </div>
          <WorkoutCustomizer
            type="strength"
            initialOptions={{
              sets: exercises[currentExercise].sets,
              reps: exercises[currentExercise].reps,
              intensity: "Medium",
              restTime: 90
            }}
            onSave={handleCustomization}
          />
        </div>
        
        <WearableDevice />
      </header>

      <section className="mb-8">
        <div className="bg-dark-light rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{exercises[currentExercise].name}</h2>
          <div className="flex justify-between text-gray-400 mb-4">
            <span>{exercises[currentExercise].sets} sets</span>
            <span>{exercises[currentExercise].reps} reps</span>
            <span>+{exercises[currentExercise].xp} XP</span>
          </div>
          
          <div className="relative aspect-video mb-4 bg-dark-lighter rounded-lg overflow-hidden">
            <img 
              src={exercises[currentExercise].gifUrl} 
              alt={`${exercises[currentExercise].name} form`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-gray-400 mb-4">{exercises[currentExercise].form}</p>
          <div className="flex space-x-4">
            <button className="flex-1 bg-primary text-dark py-3 rounded-lg font-semibold flex items-center justify-center" onClick={() => navigate("/workout/posture-correction")}>
              <Camera className="mr-2" />
              Check Form
            </button>
            <a href="https://youtu.be/6gKaoPofs6k?si=bEB1k3j2alj-RGZm" target="_blank" rel="noopener noreferrer">
              <button className="flex-1 bg-dark-lighter text-primary py-3 rounded-lg font-semibold flex items-center justify-center">
                <Play className="mr-2" />
                Tutorial
              </button>
            </a>
          </div>
        </div>

        <WorkoutTimer initialTime={60} onComplete={handleTimerComplete} />

        <div className="mt-8">
          <ProgressGraph
            title="Weight Progress (lbs)"
            data={exercises[currentExercise].progress.weights}
            labels={exercises[currentExercise].progress.dates}
            color="#00F5FF"
          />
        </div>

        <div className="space-y-4 mt-8">
          {exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => setCurrentExercise(index)}
              className={`w-full ${
                index === currentExercise ? 'bg-dark-lighter border-primary' : 'bg-dark-light'
              } border-2 rounded-xl p-4 flex items-center justify-between`}
            >
              <div className="flex items-center flex-1">
                <Dumbbell className={`${
                  index === currentExercise ? 'text-primary' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left flex-1">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.sets} sets • {exercise.reps} reps</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">+{exercise.xp} XP</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the exercise when completing
                    handleCompleteExercise(index);
                  }}
                  className={`p-1 ${exercise.completed ? "text-green-500 cursor-not-allowed" : "text-gray-400 hover:text-green-500"}`}
                  disabled={exercise.completed}
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the exercise when deleting
                    handleDeleteExercise(index);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </section>

      <WorkoutChatbot />

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
              <p className="font-semibold">Great job! +{xpEarned} XP earned!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StrengthWorkout;