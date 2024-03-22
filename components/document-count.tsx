import React from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  datasets: [
    {
      label: 'Scraper 1',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Scraper 2',
      data: [17, 6, 10, 7, 8, 12, 5],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }
  ]
};

const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  responsive: true,
  maintainAspectRatio: false // Add this to make the chart responsive
};

const DocumentCount = () => {
  return (
    <div className="w-full rounded bg-zinc-800 p-4">
      <h3 className="">Document Count</h3>
      <div className="flex h-96 flex-col">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default DocumentCount;
