import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronLeft, Play, Timer as TimerIcon, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function CardioWorkout() {
  const [selectedWorkout, setSelectedWorkout] = useState(0);

  const workouts = [
    {
      name: "HIIT Running",
      duration: 20,
      intensity: "High",
      xp: 200,
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      intervals: [
        { type: "Sprint", duration: "30 sec" },
        { type: "Walk", duration: "30 sec" },
        { type: "Repeat 20x" }
      ],
      progress: {
        speeds: [8.5, 9.0, 9.2, 9.5, 9.8, 10.0],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    },
    {
      name: "Endurance Run",
      duration: 45,
      intensity: "Medium",
      xp: 250,
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      intervals: [
        { type: "Steady Pace", duration: "45 mins" }
      ],
      progress: {
        speeds: [6.0, 6.2, 6.5, 6.8, 7.0, 7.2],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    },
    {
      name: "Hill Sprints",
      duration: 30,
      intensity: "Very High",
      xp: 300,
      gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmZiMzM5MjBmZDY4ZjZhZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4ZjY4Zg/3oEduKoCblNVAgAbYc/giphy.gif",
      intervals: [
        { type: "Uphill Sprint", duration: "45 sec" },
        { type: "Recovery Walk", duration: "60 sec" },
        { type: "Repeat 15x" }
      ],
      progress: {
        speeds: [7.0, 7.5, 8.0, 8.2, 8.5, 8.8],
        dates: ['Mon', 'Wed', 'Fri', 'Mon', 'Wed', 'Fri']
      }
    }
  ];

  const handleCustomization = (options: any) => {
    // Update workout settings
    console.log('Updated workout settings:', options);
  };

  const handleTimerComplete = () => {
    // Handle interval completion
    console.log('Interval completed!');
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

          <div className="space-y-2 mb-4">
            {workouts[selectedWorkout].intervals.map((interval, index) => (
              <div key={index} className="text-gray-400">
                • {interval.type} {interval.duration && `- ${interval.duration}`}
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <button className="flex-1 bg-primary text-dark py-3 rounded-lg font-semibold flex items-center justify-center">
              <TimerIcon className="mr-2" />
              Start Timer
            </button>
            <button className="flex-1 bg-dark-lighter text-primary py-3 rounded-lg font-semibold flex items-center justify-center">
              <Play className="mr-2" />
              Guide
            </button>
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
              <div className="flex items-center">
                <Heart className={`${
                  index === selectedWorkout ? 'text-red-500' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left">
                  <h3 className="font-semibold">{workout.name}</h3>
                  <p className="text-sm text-gray-400">{workout.duration} mins • {workout.intensity} Intensity</p>
                </div>
              </div>
              <span className="text-primary">+{workout.xp} XP</span>
            </button>
          ))}
        </div>
      </section>

      <WorkoutChatbot />
    </motion.div>
  );
}

export default CardioWorkout;