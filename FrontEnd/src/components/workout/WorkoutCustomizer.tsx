import React, { useState } from 'react';
import { Settings, Save } from 'lucide-react';

interface CustomizationOptions {
  sets?: number;
  reps?: string;
  duration?: number;
  intensity?: 'Low' | 'Medium' | 'High';
  restTime?: number;
}

interface WorkoutCustomizerProps {
  type: 'strength' | 'cardio' | 'recovery';
  initialOptions: CustomizationOptions;
  onSave: (options: CustomizationOptions) => void;
}

export default function WorkoutCustomizer({ type, initialOptions, onSave }: WorkoutCustomizerProps) {
  const [options, setOptions] = useState(initialOptions);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(options);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-dark-lighter p-3 rounded-full"
      >
        <Settings size={20} className="text-primary" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-dark-light rounded-xl p-6 shadow-lg w-80 z-10">
          <h3 className="text-lg font-semibold mb-4">Customize Workout</h3>
          
          <div className="space-y-4">
            {type === 'strength' && (
              <>
                <div>
                  <label className="block text-sm mb-2">Sets</label>
                  <input
                    type="number"
                    value={options.sets}
                    onChange={(e) => setOptions({ ...options, sets: parseInt(e.target.value) })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2"
                    min={1}
                    max={10}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Reps</label>
                  <input
                    type="text"
                    value={options.reps}
                    onChange={(e) => setOptions({ ...options, reps: e.target.value })}
                    className="w-full bg-dark-lighter rounded-lg px-4 py-2"
                    placeholder="e.g., 10-12"
                  />
                </div>
              </>
            )}

            {type === 'cardio' && (
              <div>
                <label className="block text-sm mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={options.duration}
                  onChange={(e) => setOptions({ ...options, duration: parseInt(e.target.value) })}
                  className="w-full bg-dark-lighter rounded-lg px-4 py-2"
                  min={5}
                  max={120}
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Intensity</label>
              <select
                value={options.intensity}
                onChange={(e) => setOptions({ ...options, intensity: e.target.value as 'Low' | 'Medium' | 'High' })}
                className="w-full bg-dark-lighter rounded-lg px-4 py-2"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Rest Time (seconds)</label>
              <input
                type="number"
                value={options.restTime}
                onChange={(e) => setOptions({ ...options, restTime: parseInt(e.target.value) })}
                className="w-full bg-dark-lighter rounded-lg px-4 py-2"
                min={15}
                max={300}
                step={15}
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-primary text-dark py-2 rounded-lg font-semibold flex items-center justify-center"
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}