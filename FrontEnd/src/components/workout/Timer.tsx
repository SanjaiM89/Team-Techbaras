import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  initialTime?: number; // in seconds
  onComplete?: () => void;
}

export default function Timer({ initialTime = 60, onComplete }: TimerProps) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-dark-lighter rounded-xl p-6">
      <div className="text-5xl font-bold text-center mb-6">{formatTime(time)}</div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className="bg-primary text-dark px-6 py-3 rounded-lg font-semibold flex items-center"
        >
          {isRunning ? (
            <>
              <Pause size={20} className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play size={20} className="mr-2" />
              Start
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="bg-dark px-6 py-3 rounded-lg font-semibold flex items-center"
        >
          <RotateCcw size={20} className="mr-2" />
          Reset
        </button>
      </div>
    </div>
  );
}