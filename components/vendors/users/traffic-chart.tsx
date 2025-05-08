'use client';

import { format, parseISO } from 'date-fns';
import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis
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
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { useUniqueUsersByDate } from '@/lib/hooks/useAnalytics';

function formatDate(dateString: string) {
  // GA4 returns dates in YYYYMMDD format
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return format(parseISO(`${year}-${month}-${day}`), 'MMM d');
}

const chartConfig = {
  users: {
    label: 'Daily Users',
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig;

interface TrafficChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function TrafficChart({ dateRange }: TrafficChartProps) {
  const { data, isLoading, error } = useUniqueUsersByDate(
    dateRange.from,
    dateRange.to
  );

  if (isLoading) {
    return <ChartSkeleton title="Traffic Overview" dateRange={dateRange} height={250} />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load traffic data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.data.map((item) => ({
      date: formatDate(item.date),
      users: item.count
    })) ?? [];

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer 
          config={chartConfig} 
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={140}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={64}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              strokeWidth={2}
              fill="url(#fillUsers)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
