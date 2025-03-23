import React, { useState, useEffect } from 'react';
import { Bluetooth, Heart, Activity, X } from 'lucide-react';

interface WearableData {
  heartRate: number;
  steps: number;
  calories: number;
}

export default function WearableDevice() {
  const [isConnected, setIsConnected] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [data, setData] = useState<WearableData>({
    heartRate: 0,
    steps: 0,
    calories: 0,
  });

  const connectDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['fitness_tracker'],
      });

      setDevice(device);
      setIsConnected(true);

      // Simulate real-time data updates
      startDataSimulation();
    } catch (error) {
      console.error('Bluetooth Error:', error);
    }
  };

  const disconnectDevice = () => {
    if (device) {
      device.gatt?.disconnect();
      setDevice(null);
      setIsConnected(false);
    }
  };

  // Simulate data updates for demo purposes
  const startDataSimulation = () => {
    const interval = setInterval(() => {
      setData({
        heartRate: Math.floor(Math.random() * (180 - 60) + 60),
        steps: Math.floor(Math.random() * 1000),
        calories: Math.floor(Math.random() * 500),
      });
    }, 2000);

    return () => clearInterval(interval);
  };

  return (
    <div className="bg-dark-light rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Wearable Device</h3>
        {isConnected ? (
          <button
            onClick={disconnectDevice}
            className="text-red-500 flex items-center"
          >
            <X size={20} className="mr-1" />
            Disconnect
          </button>
        ) : (
          <button
            onClick={connectDevice}
            className="text-primary flex items-center"
          >
            <Bluetooth size={20} className="mr-1" />
            Connect
          </button>
        )}
      </div>

      {isConnected && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-dark-lighter rounded-lg p-4 text-center">
            <Heart className="text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{data.heartRate}</div>
            <div className="text-sm text-gray-400">BPM</div>
          </div>
          <div className="bg-dark-lighter rounded-lg p-4 text-center">
            <Activity className="text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{data.steps}</div>
            <div className="text-sm text-gray-400">Steps</div>
          </div>
          <div className="bg-dark-lighter rounded-lg p-4 text-center">
            <Bluetooth className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{data.calories}</div>
            <div className="text-sm text-gray-400">Calories</div>
          </div>
        </div>
      )}
    </div>
  );
}