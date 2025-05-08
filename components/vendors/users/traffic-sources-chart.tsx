'use client';

import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type {
  ChartConfig} from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { useTrafficSources } from '@/lib/hooks/useAnalytics';

interface TrafficSourcesChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const chartConfig = {
  Google: {
    label: 'Google',
    color: 'hsl(var(--chart-1))'
  },
  Direct: {
    label: 'Direct',
    color: 'hsl(var(--chart-2))'
  },
  ig: {
    label: 'Instagram',
    color: 'hsl(var(--chart-3))'
  },
  Social: {
    label: 'Social',
    color: 'hsl(var(--chart-4))'
  },
  Unknown: {
    label: 'Unknown',
    color: 'hsl(var(--chart-5))'
  },
  Other: {
    label: 'Other',
    color: 'hsl(var(--chart-6))'
  }
} satisfies ChartConfig;

// Array of chart colors to cycle through for unknown sources
const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))'
];

export function TrafficSourcesChart({ dateRange }: TrafficSourcesChartProps) {
  const { data, isLoading, error } = useTrafficSources(
    dateRange.from,
    dateRange.to
  );

  if (isLoading) {
    return <ChartSkeleton title="Traffic Sources" dateRange={dateRange} height={400} />;
  }

  if (error || !data) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-sm text-red-500">
            Failed to load traffic source data
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by users count and get top sources
  const chartData = data.data
    .sort((a, b) => b.users - a.users)
    .map((item, index) => {
      // If the source exists in chartConfig, use that color
      // Otherwise, cycle through chart colors based on index
      const color =
        chartConfig[item.source as keyof typeof chartConfig]?.color ||
        chartColors[index % chartColors.length];
      return {
        ...item,
        fill: color
      };
    });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="source" tick={{ fontSize: 12 }} interval={0} />
              <YAxis
                tickFormatter={(value) => value.toLocaleString()}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" fill="var(--primary / 0.8)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
