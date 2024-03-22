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
  complete: '#15803d', // green-700
  error: '#be123c', // rose-700
  in_progress: '#eab308' // yellow
};

type Props = {
  tasks: IScraperTaskData[];
};

const ScraperMonitor: React.FC<Props> = ({
  tasks
}: Props): React.ReactElement => {
  const [datasets, setDatasets] = useState<Array<Dataset>>([]);

  useEffect(() => {
    const newDatasets: Dataset[] = tasks.map((task, index) => ({
      label: task.name,
      data: task.timestamps.map((entry) => ({
        x: entry.time,
        y: index
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
      <div className="w-full overflow-x-scroll sm:overflow-x-auto">
        <div className=" h-48 w-full min-w-[425px]">
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
    </div>
  );
};

export default ScraperMonitor;
