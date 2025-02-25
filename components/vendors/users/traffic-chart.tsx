"use client"

import { format, parseISO } from "date-fns"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Users } from "lucide-react"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useUniqueUsersByDate } from "@/lib/hooks/useAnalytics"
import { 
  Card,
  CardContent,
  CardDescription,
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

interface TrafficChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function TrafficChart({ dateRange }: TrafficChartProps) {
  const { data, isLoading, error } = useUniqueUsersByDate(dateRange.from, dateRange.to);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitor trends for selected period</CardDescription>
          </div>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitor trends for selected period</CardDescription>
          </div>
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>
              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
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
              <Area
                type="monotone"
                dataKey="users"
                stroke={chartConfig.users.color}
                fill={chartConfig.users.color}
                fillOpacity={0.2}
              />
              <ChartTooltip content={<CustomTooltip />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

