import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUsersByDevice } from '@/lib/hooks/useAnalytics';

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))'
  },
  tablet: {
    label: 'Tablet',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

interface UserDeviceChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function UserDeviceChart({ dateRange }: UserDeviceChartProps) {
  const { data, isLoading, error } = useUsersByDevice(
    dateRange.from,
    dateRange.to
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <LoadingSpinner size={40} />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load device data</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.desktop + data.mobile + data.tablet;
  const chartData = [
    {
      device: 'desktop',
      visitors: data.desktop,
      percentage: Math.round((data.desktop / total) * 100),
      fill: chartConfig.desktop.color
    },
    {
      device: 'mobile',
      visitors: data.mobile,
      percentage: Math.round((data.mobile / total) * 100),
      fill: chartConfig.mobile.color
    },
    {
      device: 'tablet',
      visitors: data.tablet,
      percentage: Math.round((data.tablet / total) * 100),
      fill: chartConfig.tablet.color
    }
  ];

  // Find the dominant device type
  const dominantDevice = chartData.reduce((prev, current) =>
    current.percentage > prev.percentage ? current : prev
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Device Distribution</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Device
                        </span>
                        <span className="font-bold capitalize">
                          {data.device}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Users
                        </span>
                        <span className="font-bold">
                          {data.visitors.toLocaleString()} ({data.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="device"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (
                    viewBox &&
                    'cx' in viewBox &&
                    'cy' in viewBox &&
                    viewBox.cy !== undefined
                  ) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 12}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {dominantDevice.percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 12}
                          className="fill-muted-foreground text-sm capitalize"
                        >
                          {dominantDevice.device}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Distribution of users by device type
        </div>
      </CardFooter>
    </Card>
  );
}
