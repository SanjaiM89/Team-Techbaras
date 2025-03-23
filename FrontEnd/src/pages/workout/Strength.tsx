import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ChevronLeft, Play, Camera, Timer as TimerIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';
import { useNavigate } from "react-router-dom";

function StrengthWorkout() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const navigate = useNavigate();
  const exercises = [
    {
      name: "Bench Press",
      sets: 4,
      reps: "10-12",
      xp: 75,
      form: "Keep your back flat on the bench, feet planted firmly on the ground.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      progress: {
        weights: [135, 145, 155, 165, 175, 185],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    },
    {
      name: "Shoulder Press",
      sets: 3,
      reps: "12-15",
      xp: 60,
      form: "Keep core tight, avoid arching your back.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      progress: {
        weights: [85, 90, 95, 100, 105, 110],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    },
    {
      name: "Lat Pulldowns",
      sets: 4,
      reps: "12-15",
      xp: 65,
      form: "Pull the bar to your upper chest, squeeze your lats.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      progress: {
        weights: [120, 130, 140, 150, 160, 170],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    },
    {
      name: "Bicep Curls",
      sets: 3,
      reps: "12-15",
      xp: 50,
      form: "Keep elbows fixed, avoid swinging.",
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      progress: {
        weights: [30, 35, 35, 40, 40, 45],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    }
  ];

  const handleCustomization = (options: any) => {
    // Update workout settings
    console.log('Updated workout settings:', options);
  };

  const handleTimerComplete = () => {
    // Handle timer completion (e.g., move to next set)
    console.log('Timer completed!');
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
            <button className="flex-1 bg-dark-lighter text-primary py-3 rounded-lg font-semibold flex items-center justify-center">
              <Play className="mr-2" />
              Tutorial
            </button>
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
              <div className="flex items-center">
                <Dumbbell className={`${
                  index === currentExercise ? 'text-primary' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.sets} sets • {exercise.reps} reps</p>
                </div>
              </div>
              <span className="text-primary">+{exercise.xp} XP</span>
            </button>
          ))}
        </div>
      </section>

      <WorkoutChatbot />
    </motion.div>
  );
}

export default StrengthWorkout;