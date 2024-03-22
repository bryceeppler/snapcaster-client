import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { IScraperTaskData } from '@/pages/tools/scraper-report';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';

import { Chart, ChartArea } from 'chart.js';
const rowColors: string[] = ['#3f3f46', '#27272a'];
// plugin to draw background colors for each row
const rowBackgroundPlugin = {
  id: 'rowBackgroundPlugin',
  beforeDraw: (chart: Chart) => {
    const ctx = chart.ctx;
    const chartArea: ChartArea = chart.chartArea;
    const yAxis = chart.scales.y;

    chart.data.datasets.forEach((dataset, index) => {
      const yTop = yAxis?.getPixelForValue(index + 0.5); // Top of the row
      const yBottom = yAxis?.getPixelForValue(index - 0.5); // Bottom of the row
      const color = rowColors[index % rowColors.length]; // Get color for the row

      // Set the fill style to the row color and draw the rectangle
      ctx.fillStyle = color;
      ctx.fillRect(
        chartArea.left,
        yBottom,
        chartArea.right - chartArea.left,
        yTop - yBottom
      );
    });
  }
};

ChartJS.register(rowBackgroundPlugin);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface Dataset {
  label: string;
  data: Array<{ x: string; y: number }>;
  backgroundColor: string[];
}

const colorMapping: { [status: string]: string } = {
  complete: 'green',
  error: 'red',
  in_progress: 'blue'
};

type Props = {
  tasks: IScraperTaskData[];
};

const ScraperMonitor: React.FC<Props> = ({
  tasks
}: Props): React.ReactElement => {
  // const tasks: IScraperTaskData[] = [
  //   {
  //     name: 'conductcommerce',
  //     timestamps: [
  //       { time: '2022-09-16T09:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-17T09:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-18T09:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-19T09:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-20T09:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-21T08:00:00.000Z', status: 'complete' },
  //       { time: '2022-09-22T09:00:00.000Z', status: 'complete' }
  //     ]
  //   },
  // ];

  const [datasets, setDatasets] = useState<Array<Dataset>>([]);

  useEffect(() => {
    const newDatasets: Dataset[] = tasks.map((task, index) => ({
      label: task.name,
      data: task.timestamps.map((entry) => ({
        x: entry.time,
        y: index // Yaxis will be the index in the tasks array
      })),
      backgroundColor: task.timestamps.map(
        (entry) => colorMapping[entry.status]
      )
    }));

    setDatasets(newDatasets);
  }, [tasks]);

  return (
    <div className="w-full rounded bg-zinc-800 p-4">
      <h3>Scraper Tasks</h3>
      <div className="p-2"></div>
      <div className=" h-48 w-full">
        <Scatter
          data={{
            datasets: datasets.map((dataset, i) => ({
              ...dataset,
              pointRadius: 8
            }))
          }}
          options={{
            responsive: true,

            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (
                    tickValue: number | string,
                    index: number,
                    ticks: any
                  ) {
                    return (
                      tasks[
                        typeof tickValue === 'number'
                          ? tickValue
                          : parseInt(tickValue)
                      ]?.name || ''
                    );
                  }
                }
              },
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                  tooltipFormat: 'dd:HH'
                },
                title: {
                  display: true,
                  text: 'Time'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            maintainAspectRatio: false
          }}
        />
      </div>
    </div>
  );
};

export default ScraperMonitor;
