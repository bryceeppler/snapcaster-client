"use client"

import * as React from "react"
import { format } from "date-fns"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartSkeleton } from "@/components/vendors/dashboard/chart-skeleton"

// Mock data - in a real implementation, this would come from an API
const generateMockData = (startDate: Date, endDate: Date) => {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Generate random but somewhat realistic data
    const totalUsers = Math.floor(Math.random() * 300) + 100;
    const mobilePercentage = Math.random() * 0.4 + 0.3; // 30-70% mobile
    const mobileUsers = Math.floor(totalUsers * mobilePercentage);
    const desktopUsers = totalUsers - mobileUsers;
    
    data.push({
      date: format(currentDate, "yyyy-MM-dd"),
      desktop: desktopUsers,
      mobile: mobileUsers
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-0))"
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))"
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

interface UserDeviceAreaChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function UserDeviceAreaChart({ dateRange }: UserDeviceAreaChartProps) {
  // In a real implementation, this would be a data fetching hook
  const [isLoading, setIsLoading] = React.useState(true);
  const chartData = React.useMemo(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
    return generateMockData(dateRange.from, dateRange.to);
  }, [dateRange.from, dateRange.to]);

  if (isLoading) {
    return <ChartSkeleton title="Device Usage Over Time" dateRange={dateRange} height={250} />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Device Usage Over Time</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
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
              minTickGap={64}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 