import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressGraphProps {
  title: string;
  data: number[];
  labels: string[];
  color: string;
}

export default function ProgressGraph({ title, data, labels, color }: ProgressGraphProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: '#2D2D2D',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: '#2D2D2D',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <div className="bg-dark-light rounded-xl p-6">
      <Line data={chartData} options={options} />
    </div>
  );
}