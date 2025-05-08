import type { ChartData, ChartOptions } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UsersByDeviceData } from '@/lib/GA4Client';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DeviceDistributionChartProps {
  deviceData: UsersByDeviceData;
  variant: 'light' | 'dark';
}

export function DeviceDistributionChart({
  deviceData,
  variant
}: DeviceDistributionChartProps) {
  const chartData: ChartData<'doughnut'> = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [deviceData.desktop, deviceData.mobile, deviceData.tablet],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Indigo for Desktop
          'rgba(167, 139, 250, 0.8)', // Purple for Mobile
          'rgba(147, 197, 253, 0.8)' // Blue for Tablet
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(167, 139, 250, 1)',
          'rgba(147, 197, 253, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: variant === 'dark' ? 'white' : 'rgb(15, 23, 42)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor:
          variant === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)',
        titleColor:
          variant === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(15, 23, 42)',
        bodyColor:
          variant === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(15, 23, 42)',
        borderColor:
          variant === 'dark' ? 'rgb(51, 65, 85)' : 'rgb(226, 232, 240)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce(
              (a, b) => a + b,
              0
            );
            const percentage =
              total > 0 ? Math.round((value / total) * 100) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <Card className="h-[400px] bg-popover/20 text-white">
      <CardHeader>
        <CardTitle className="text-center">User Device Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
