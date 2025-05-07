"use client"

import * as React from 'react';
import { Pie, PieChart, Label, Cell } from 'recharts';
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
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { useUsersByDevice } from '@/lib/hooks/useAnalytics';
import { PieChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'hsl(var(--chart-0))'
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

  const dominantDevice = React.useMemo(() => {
    if (!data) return { device: '', percentage: 0 };
    
    const total = data.desktop + data.mobile + data.tablet;
    const devices = [
      {
        device: 'desktop',
        visitors: data.desktop,
        percentage: Math.round((data.desktop / total) * 100)
      },
      {
        device: 'mobile',
        visitors: data.mobile,
        percentage: Math.round((data.mobile / total) * 100)
      },
      {
        device: 'tablet',
        visitors: data.tablet,
        percentage: Math.round((data.tablet / total) * 100)
      }
    ];
    
    return devices.reduce((prev, current) =>
      current.percentage > prev.percentage ? current : prev
    );
  }, [data]);

  if (isLoading) {
    return <PieChartSkeleton title="Device Distribution" dateRange={dateRange} />;
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
        <CardContent className="flex h-[300px] items-center justify-center">
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
      percentage: Math.round((data.desktop / total) * 100)
    },
    {
      device: 'mobile',
      visitors: data.mobile,
      percentage: Math.round((data.mobile / total) * 100)
    },
    {
      device: 'tablet',
      visitors: data.tablet,
      percentage: Math.round((data.tablet / total) * 100)
    }
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Device Distribution</CardTitle>
        <CardDescription>
          {format(dateRange.from, 'LLL dd, y')} -{' '}
          {format(dateRange.to, 'LLL dd, y')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer 
          config={chartConfig} 
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="device"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell 
                  key={entry.device} 
                  fill={chartConfig[entry.device as keyof typeof chartConfig]?.color} 
                />
              ))}
              <Label
                content={({ viewBox }: { viewBox?: any }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {dominantDevice.percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
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
            <ChartLegend 
              verticalAlign="bottom" 
              height={36} 
              content={<ChartLegendContent />} 
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {chartData.length > 0 && (
        <CardFooter className="flex-col gap-2 text-sm pt-6">
          <div className="leading-none text-muted-foreground">
            Showing device distribution for selected date range
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
