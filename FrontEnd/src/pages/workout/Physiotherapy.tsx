import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Bone } from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkoutChatbot from '../../components/WorkoutChatbot';
import WorkoutTimer from '../../components/workout/Timer';
import WearableDevice from '../../components/workout/WearableDevice';
import ProgressGraph from '../../components/workout/ProgressGraph';
import WorkoutCustomizer from '../../components/workout/WorkoutCustomizer';

function PhysiotherapyWorkout() {
  const [selectedExercise, setSelectedExercise] = useState(0);

  const exercises = [
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
      }
    },
    {
      name: "Knee Rehabilitation",
      duration: 20,
      focus: "Joint Mobility",
      intensity: "Low",
      xp: 120,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714966/kneerehab_j79nso.gif",
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
      }
    },
    {
      name: "Shoulder Mobility",
      duration: 18,
      focus: "Range of Motion",
      intensity: "Medium",
      xp: 110,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714972/shouldermobility_kuhcxo.gif",
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
      }
    },
    {
      name: "Neck Pain Relief",
      duration: 15,
      focus: "Cervical Spine",
      intensity: "Low",
      xp: 90,
      gifUrl: "https://res.cloudinary.com/dzqxtjau7/image/upload/v1742714985/neckpain_bbclak.webp",
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
      }
    }
  ];

  const handleCustomization = (options: any) => {
    // Update exercise settings
    console.log('Updated exercise settings:', options);
  };

  const handleTimerComplete = () => {
    // Handle exercise completion
    console.log('Exercise completed!');
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

          <div className="space-y-2 mb-4">
            {exercises[selectedExercise].steps.map((step, index) => (
              <div key={index} className="text-gray-400">
                • {step}
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
          <a href="https://youtu.be/zME4tZ4s-UE?si=XQS70ouDJIGNYtR1" target="_blank" rel="noopener noreferrer">
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
              <div className="flex items-center">
                <Bone className={`${
                  index === selectedExercise ? 'text-green-500' : 'text-gray-400'
                } mr-3`} />
                <div className="text-left">
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.duration} mins • {exercise.focus}</p>
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

export default PhysiotherapyWorkout;