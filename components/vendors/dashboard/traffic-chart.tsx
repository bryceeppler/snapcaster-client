"use client"

import { format, parseISO } from "date-fns"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useUniqueUsers } from "@/lib/hooks/useAnalytics"
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

function formatDate(dateString: string) {
  // GA4 returns dates in YYYYMMDD format
  const year = dateString.substring(0, 4)
  const month = dateString.substring(4, 6)
  const day = dateString.substring(6, 8)
  return format(parseISO(`${year}-${month}-${day}`), 'MMM d')
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Date
          </span>
          <span className="font-bold">{label}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            Users
          </span>
          <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

const chartConfig = {
  users: {
    label: "Daily Users",
    color: "hsl(var(--primary))",
  },
};

export function TrafficChart() {
  const { data, isLoading, error } = useUniqueUsers(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visitor trends over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <LoadingSpinner size={40} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Visitor trends over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load traffic data</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.data.map(item => ({
    date: formatDate(item.date),
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
    <Card>
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>Visitor trends over the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                bottom: 0,
                left: 10,
              }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="10 10" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => value}
                interval={"preserveStartEnd"}
                minTickGap={50}
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
                content={<CustomTooltip />}
                cursor={false}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--color-users)"
                fill="var(--color-users)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className={`flex items-center gap-2 font-medium leading-none ${trendColor}`}>
              {isPositiveChange ? 'Up' : 'Down'} by {Math.abs(percentageChange).toFixed(1)}% vs previous period
              <TrendIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {firstDate} - {lastDate}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

