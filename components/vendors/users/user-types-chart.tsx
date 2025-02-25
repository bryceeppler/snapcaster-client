"use client"

import { format } from "date-fns"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useUserTypes } from "@/lib/hooks/useAnalytics"
import { ChartContainer, ChartConfig } from "@/components/ui/chart"

interface UserTypesChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const chartConfig = {
  "New": {
    label: "New Users",
    color: "hsl(var(--chart-1))"
  },
  "Returning": {
    label: "Returning Users",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

export function UserTypesChart({ dateRange }: UserTypesChartProps) {
  const { data, isLoading, error } = useUserTypes(dateRange.from, dateRange.to);

  const returningUsers = data?.data.filter((user) => user.type === "Returning").reduce((acc, user) => acc + user.users, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Types</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
          <CardTitle>User Types</CardTitle>
          <CardDescription>
            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load user type data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>User Types</CardTitle>
        <CardDescription>
          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
        </CardDescription>
      </CardHeader>
      <CardContent>
          <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
            <PieChart>
              <Pie
                data={data.data}
                dataKey="users"
                nameKey="type"
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
                          {returningUsers}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 12}
                          className="fill-muted-foreground text-sm capitalize"
                        >
                          Returning Users
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
                {data.data.map((entry) => (
                  <Cell 
                    key={entry.type} 
                    fill={chartConfig[entry.type as keyof typeof chartConfig]?.color} 
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Type
                          </span>
                          <span className="font-bold">{data.type}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Users
                          </span>
                          <span className="font-bold">
                            {data.users.toLocaleString()} ({data.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
      </CardContent>
    </Card>
  );
} 