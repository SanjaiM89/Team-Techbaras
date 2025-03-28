import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronLeft, Play, Clock as ClockIcon, CheckCircle, Trash2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function RecoveryWorkout() {
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [exercises, setExercises] = useState([
    {
      name: "Full Body Stretch",
      duration: 15,
      focus: "Flexibility",
      intensity: "Medium",
      xp: 100,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714362/fullbodystretch_vlkwnl.gif",
      steps: [
        "Start with neck rotations",
        "Shoulder rolls and arm circles",
        "Hip flexor stretches",
        "Hamstring stretches",
        "Lower back stretches"
      ],
      progress: {
        flexibility: [3, 4, 4, 5, 5, 6],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Yoga Flow",
      duration: 20,
      focus: "Balance & Flexibility",
      intensity: "Low",
      xp: 150,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714445/yogaflow_ppnzsd.gif",
      steps: [
        "Sun Salutation A",
        "Warrior I & II",
        "Downward Dog",
        "Child's Pose",
        "Savasana"
      ],
      progress: {
        flexibility: [4, 4, 5, 5, 6, 7],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    }
  ]);
  const [showCompletionModal, setShowCompletionModal] = useState(false); // State for success modal
  const [xpEarned, setXpEarned] = useState<number>(0); // State for XP earned

  const handleCustomization = (options: any) => {
    console.log('Updated exercise settings:', options);
  };

  const handleTimerComplete = () => {
    console.log('Exercise completed!');
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
    if (selectedExercise === index) {
      setSelectedExercise(0); // Reset to first exercise if deleted one was selected
    } else if (selectedExercise > index) {
      setSelectedExercise(selectedExercise - 1); // Adjust index if deleted exercise was before selected
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
              <h1 className="text-2xl font-bold">Recovery & Mobility</h1>
              <p className="text-gray-400">Restore & Rejuvenate • +150 XP</p>
            </div>
          </div>
          <WorkoutCustomizer
            type="recovery"
            initialOptions={{
              duration: exercises[selectedExercise].duration,
              intensity: "Low",
              restTime: 30
            }}
            onSave={handleCustomization}
          />
        </div>

        <WearableDevice />
      </header>

      <section className="mb-8">
        <div className="bg-dark-light rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{exercises[selectedExercise].name}</h2>
          <div className="flex justify-between text-gray-400 mb-4">
            <span>{exercises[selectedExercise].duration} mins</span>
            <span>Focus: {exercises[selectedExercise].focus}</span>
            <span>+{exercises[selectedExercise].xp} XP</span>
          </div>

          <div className="relative aspect-video mb-4 bg-dark-lighter rounded-lg overflow-hidden">
            <img 
              src={exercises[selectedExercise].gifUrl} 
              alt={`${exercises[selectedExercise].name} demonstration`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2 mb-4">
            {exercises[selectedExercise].steps.map((step, index) => (
              <div key={index} className="text-gray-400">
                • {step}
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <a href="https://youtu.be/gfzC9XMEypg?si=wF12V3Ilz97WfCyg" target="_blank" rel="noopener noreferrer">
              <button className="flex-1 bg-dark-lighter text-primary py-3 rounded-lg font-semibold flex items-center justify-center">
                <Play className="mr-2" />
                Guide
              </button>
            </a>
          </div>
        </div>

        <WorkoutTimer initialTime={exercises[selectedExercise].duration * 60} onComplete={handleTimerComplete} />

        <div className="mt-8">
          <ProgressGraph
            title="Flexibility Score (1-10)"
            data={exercises[selectedExercise].progress.flexibility}
            labels={exercises[selectedExercise].progress.dates}
            color="#A78BFA"
          />
        </div>

        <div className="space-y-4 mt-8">
          {exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => setSelectedExercise(index)}
              className={`w-full ${
                index === selectedExercise ? 'bg-dark-lighter border-primary' : 'bg-dark-light'
              } border-2 rounded-xl p-4 flex items-center justify-between`}
            >
              <div className="flex items-center flex-1">
                <Brain className={`${
                  index === selectedExercise ? 'text-purple-500' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left flex-1">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.duration} mins • {exercise.focus}</p>
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

export default RecoveryWorkout;