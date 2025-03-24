import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, Play, Timer as TimerIcon, Trophy, CheckCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function CardioWorkout() {
  const [selectedWorkout, setSelectedWorkout] = useState(0);
  const [workouts, setWorkouts] = useState([
    {
      name: "HIIT Running",
      duration: 20,
      intensity: "High",
      xp: 200,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742712915/hiit_lu90lh.gif",
      intervals: [
        { type: "Sprint", duration: "30 sec" },
        { type: "Walk", duration: "30 sec" },
        { type: "Repeat 20x" }
      ],
      progress: {
        speeds: [8.5, 9.0, 9.2, 9.5, 9.8, 10.0],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Endurance Run",
      duration: 45,
      intensity: "Medium",
      xp: 250,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742713552/endurencerun_vjx5wi.gif",
      intervals: [
        { type: "Steady Pace", duration: "45 mins" }
      ],
      progress: {
        speeds: [6.0, 6.2, 6.5, 6.8, 7.0, 7.2],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      },
      completed: false // Added completed field
    },
    {
      name: "Hill Sprints",
      duration: 30,
      intensity: "Very High",
      xp: 300,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742713559/hillsprints_ekup8p.gif",
      intervals: [
        { type: "Uphill Sprint", duration: "45 sec" },
        { type: "Recovery Walk", duration: "60 sec" },
        { type: "Repeat 15x" }
      ],
      progress: {
        speeds: [7.0, 7.5, 8.0, 8.2, 8.5, 8.8],
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
    console.log('Interval completed!');
  };

  const handleCompleteWorkout = (index: number) => {
    const updatedWorkouts = [...workouts];
    if (!updatedWorkouts[index].completed) {
      updatedWorkouts[index].completed = true;
      setWorkouts(updatedWorkouts);
      setXpEarned(updatedWorkouts[index].xp); // Set XP for the modal
      setShowCompletionModal(true);
      setTimeout(() => setShowCompletionModal(false), 3000); // Hide modal after 3 seconds
    }
  };

  const handleDeleteWorkout = (index: number) => {
    const updatedWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(updatedWorkouts);
    if (selectedWorkout === index) {
      setSelectedWorkout(0); // Reset to first workout if deleted one was selected
    } else if (selectedWorkout > index) {
      setSelectedWorkout(selectedWorkout - 1); // Adjust index if deleted workout was before selected
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
              <h1 className="text-2xl font-bold">Cardio Training</h1>
              <p className="text-gray-400">Heart-pumping workouts • +250 XP</p>
            </div>
          </div>
          <WorkoutCustomizer
            type="cardio"
            initialOptions={{
              duration: workouts[selectedWorkout].duration,
              intensity: "Medium",
              restTime: 60
            }}
            onSave={handleCustomization}
          />
        </div>

        <WearableDevice />
      </header>

      <section className="mb-8">
        <div className="bg-dark-light rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">{workouts[selectedWorkout].name}</h2>
          <div className="flex justify-between text-gray-400 mb-4">
            <span>{workouts[selectedWorkout].duration} mins</span>
            <span>Intensity: {workouts[selectedWorkout].intensity}</span>
            <span>+{workouts[selectedWorkout].xp} XP</span>
          </div>

          <div className="relative aspect-video mb-4 bg-dark-lighter rounded-lg overflow-hidden">
            <img 
              src={workouts[selectedWorkout].gifUrl} 
              alt={`${workouts[selectedWorkout].name} demonstration`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-start mb-4">
            <div className="space-y-2 flex-1">
              {workouts[selectedWorkout].intervals.map((interval, index) => (
                <div key={index} className="text-gray-400">
                  • {interval.type} {interval.duration && `- ${interval.duration}`}
                </div>
              ))}
            </div>
            <a href="https://youtu.be/vnBXaCsoEPU?si=bbkbhuvmaOeRZY2J" target="_blank" rel="noopener noreferrer">
              <button className="bg-dark-lighter text-primary py-2 px-4 rounded-lg font-semibold flex items-center ml-4">
                <Play className="mr-2" />
                Guide
              </button>
            </a>
          </div>
        </div>

        <WorkoutTimer initialTime={workouts[selectedWorkout].duration * 60} onComplete={handleTimerComplete} />

        <div className="mt-8">
          <ProgressGraph
            title="Speed Progress (mph)"
            data={workouts[selectedWorkout].progress.speeds}
            labels={workouts[selectedWorkout].progress.dates}
            color="#FF4B4B"
          />
        </div>

        <div className="space-y-4 mt-8">
          {workouts.map((workout, index) => (
            <button
              key={index}
              onClick={() => setSelectedWorkout(index)}
              className={`w-full ${
                index === selectedWorkout ? 'bg-dark-lighter border-primary' : 'bg-dark-light'
              } border-2 rounded-xl p-4 flex items-center justify-between`}
            >
              <div className="flex items-center flex-1">
                <Heart className={`${
                  index === selectedWorkout ? 'text-red-500' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left flex-1">
                  <h3 className="font-semibold">{workout.name}</h3>
                  <p className="text-sm text-gray-400">{workout.duration} mins • {workout.intensity} Intensity</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-primary">+{workout.xp} XP</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the workout when completing
                    handleCompleteWorkout(index);
                  }}
                  className={`p-1 ${workout.completed ? "text-green-500 cursor-not-allowed" : "text-gray-400 hover:text-green-500"}`}
                  disabled={workout.completed}
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the workout when deleting
                    handleDeleteWorkout(index);
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

export default CardioWorkout;