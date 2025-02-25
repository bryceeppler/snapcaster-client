"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"

import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/vendors/dashboard/chart-skeleton"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useUniqueUsers } from "@/lib/hooks/useAnalytics"
import { formatChartDate } from "@/lib/utils"

const chartConfig = {
  users: {
    label: "Daily Users",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig;

interface TrafficChartProps {
  numberOfDays?: number;
  chartHeight?: number | string;
  className?: string;
}

export function TrafficChart({
  numberOfDays = 30,
  chartHeight = 250,
  className
}: TrafficChartProps) {
  const { data, isLoading, error } = useUniqueUsers(numberOfDays);
  
  // Convert chartHeight to a string with 'px' if it's a number
  const heightClass = typeof chartHeight === 'number' ? `h-[${chartHeight}px]` : chartHeight;

  if (isLoading) {
    return (
      <ChartSkeleton title="Traffic Overview" height={chartHeight as number} description="Visitor trends over the past 30 days" footer={true} />
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visitor trends over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent className={`flex items-center justify-center ${heightClass}`}>
          <p className="text-sm text-red-500">Failed to load traffic data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.data.map(item => ({
    date: formatChartDate(item.date),
    users: item.count
  })) ?? [];

  // Calculate percentage change for the footer
  const percentageChange = data?.percentageChange ?? 0;
  const isPositiveChange = percentageChange >= 0;
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;
  const trendColor = isPositiveChange ? "text-green-600" : "text-red-600";

  // Get date range for footer
  const firstDate = chartData[0]?.date ?? '';
  const lastDate = chartData[chartData.length - 1]?.date ?? '';

  return (
    <Card className={className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visitor trends over the past 30 days</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer 
          config={chartConfig} 
          className={`aspect-auto ${heightClass} w-full`}
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
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
      <CardFooter className="flex-col gap-2 text-sm pt-2">
        <div className={`flex items-center gap-2 font-medium leading-none ${trendColor}`}>
          {isPositiveChange ? 'Up' : 'Down'} by {Math.abs(percentageChange).toFixed(1)}% vs previous period
          <TrendIcon className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {firstDate} - {lastDate}
        </div>
      </CardFooter>
    </Card>
  );
}

