'use client';

import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTrafficSources } from '@/lib/hooks/useAnalytics';
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip
} from '@/components/ui/chart';

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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <LoadingSpinner size={40} />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
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
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>
          {format(dateRange.from, 'LLL dd, y')} -{' '}
          {format(dateRange.to, 'LLL dd, y')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
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
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Source
                        </span>
                        <span className="font-bold">{data.source}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Users
                        </span>
                        <span className="font-bold">
                          {data.users.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="users" fill="var(--primary / 0.8)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
