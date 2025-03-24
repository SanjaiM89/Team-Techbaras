import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ChevronLeft, Play, Timer as TimerIcon, Bone, CheckCircle, Trash2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function PhysiotherapyWorkout() {
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [exercises, setExercises] = useState([
    {
      name: "Lower Back Relief",
      duration: 15,
      focus: "Spine Health",
      intensity: "Low",
      xp: 100,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714959/lowerback_qfnhlt.gif",
      steps: [
        "Cat-Cow Stretches (2 mins)",
        "Pelvic Tilts (2 mins)",
        "Bird Dog Exercise (3 mins)",
        "Child's Pose (2 mins)",
        "Gentle Twists (2 mins)"
      ],
      progress: {
        painLevel: [7, 6, 5, 4, 3, 2],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Knee Rehabilitation",
      duration: 20,
      focus: "Joint Mobility",
      intensity: "Low",
      xp: 120,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714962/knee_ez2t0g.gif",
      steps: [
        "Heel Slides (3 mins)",
        "Straight Leg Raises (3 mins)",
        "Hamstring Stretches (3 mins)",
        "Calf Raises (3 mins)",
        "Balance Training (3 mins)"
      ],
      progress: {
        painLevel: [8, 7, 6, 4, 3, 2],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Shoulder Mobility",
      duration: 18,
      focus: "Range of Motion",
      intensity: "Medium",
      xp: 110,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714965/shoulder_hf3mrc.gif",
      steps: [
        "Pendulum Swings (3 mins)",
        "Wall Slides (3 mins)",
        "External Rotation (3 mins)",
        "Cross-body Stretch (3 mins)",
        "Scapular Retraction (3 mins)"
      ],
      progress: {
        painLevel: [6, 5, 4, 3, 2, 1],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Neck Pain Relief",
      duration: 15,
      focus: "Cervical Spine",
      intensity: "Low",
      xp: 90,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714968/neck_aac8k7.gif",
      steps: [
        "Chin Tucks (2 mins)",
        "Neck Rotations (2 mins)",
        "Side Bends (2 mins)",
        "Isometric Holds (2 mins)",
        "Upper Trap Stretch (2 mins)"
      ],
      progress: {
        painLevel: [7, 6, 5, 3, 2, 1],
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
              <h1 className="text-2xl font-bold">Physiotherapy</h1>
              <p className="text-gray-400">Rehabilitation & Pain Relief • +100 XP</p>
            </div>
          </div>
          <WorkoutCustomizer
            type="recovery"
            initialOptions={{
              duration: exercises[selectedExercise].duration,
              intensity: exercises[selectedExercise].intensity as 'Low' | 'Medium' | 'High',
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

          <div className="flex items-start mb-4">
            <div className="space-y-2 flex-1">
              {exercises[selectedExercise].steps.map((step, index) => (
                <div key={index} className="text-gray-400">
                  • {step}
                </div>
              ))}
            </div>
            <a href="https://youtu.be/zME4tZ4s-UE?si=XQS70ouDJIGNYtR1" target="_blank" rel="noopener noreferrer">
              <button className="bg-dark-lighter text-primary py-2 px-4 rounded-lg font-semibold flex items-center ml-4">
                <Play className="mr-2" />
                Guide
              </button>
            </a>
          </div>
        </div>

        <WorkoutTimer initialTime={exercises[selectedExercise].duration * 60} onComplete={handleTimerComplete} />

        <div className="mt-8">
          <ProgressGraph
            title="Pain Level (1-10)"
            data={exercises[selectedExercise].progress.painLevel}
            labels={exercises[selectedExercise].progress.dates}
            color="#10B981"
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
                <Bone className={`${
                  index === selectedExercise ? 'text-green-500' : 'text-gray-400'
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

export default PhysiotherapyWorkout;