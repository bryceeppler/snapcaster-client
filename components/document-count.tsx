import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { IDocumentCountData } from '@/pages/tools/scraper-report';
import { useState } from 'react';
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
      beginAtZero: false
    }
  },
  responsive: true,
  maintainAspectRatio: false // Add this to make the chart responsive
};

type Props = {
  data: IDocumentCountData;
};

interface IChartDataSet {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }>;
}

const chartColors = [
  // rose-400, purple-400 sky-400 cyan-400
  '#EB5286',
  '#9F7AEA',
  '#60A5FA',
  '#fdba74'
];

const DocumentCount = ({ data }: Props) => {
  const [chartData, setChartData] = useState<IChartDataSet>(data);

  useEffect(() => {
    const newDatasets = data.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: chartColors[index % chartColors.length],
      backgroundColor: `${chartColors[index % chartColors.length]}4D` // '4D' is the hex opacity for approximately 0.3 opacity
    }));

    setChartData({
      ...data,
      datasets: newDatasets
    });
  }, [data]);

  return (
    <div className="w-full rounded bg-zinc-800  p-5 md:p-8">
      <h3 className="text-xl font-semibold">Document Count</h3>
      <div className="p-2"></div>

      <div className="flex h-96 flex-col">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DocumentCount;
