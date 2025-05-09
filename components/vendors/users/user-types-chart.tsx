'use client';

import { format } from 'date-fns';
import * as React from 'react';
import { PieChart, Pie, Cell, Label } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { PieChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { useUserTypes } from '@/lib/hooks/useAnalytics';

interface UserTypesChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-0))'
  },
  New: {
    label: 'New Users',
    color: 'hsl(var(--chart-1))'
  },
  Returning: {
    label: 'Returning Users',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

// Type definitions for the chart data
interface UserTypeData {
  type: string;
  users: number;
  percentage: number;
}

// Payload structure for recharts tooltip
interface TooltipPayloadItem {
  name: string;
  value: number;
  dataKey: string;
  payload: {
    payload: UserTypeData;
    stroke: string;
    fill: string;
    cx: string;
    cy: string;
    strokeWidth: number;
  } & UserTypeData;
}

// Custom tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0];
  if (!entry) return null;

  const value = entry.value;
  const name = entry.name;

  return (
    <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="grid gap-1.5">
        <div className="flex w-full items-center gap-2">
          <div
            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: entry.payload.fill }}
          />
          <div className="flex flex-1 items-center justify-between gap-8">
            <span className="text-muted-foreground">{name}</span>
            <span className="font-mono font-medium tabular-nums text-foreground">
              {value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserTypesChart({ dateRange }: UserTypesChartProps) {
  const { data, isLoading, error } = useUserTypes(dateRange.from, dateRange.to);

  const returningUsers = React.useMemo(() => {
    if (!data?.data) return 0;
    return data.data
      .filter((user) => user.type === 'Returning')
      .reduce((acc, user) => acc + user.users, 0);
  }, [data]);

  const chartData = React.useMemo(() => {
    if (!data?.data) return [];

    const total = data.data.reduce((acc, user) => acc + user.users, 0);

    return data.data.map((user) => ({
      ...user,
      percentage: Math.round((user.users / total) * 100)
    }));
  }, [data]);

  if (isLoading) {
    return <PieChartSkeleton title="User Types" dateRange={dateRange} />;
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>User Types</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} -{' '}
            {format(dateRange.to, 'LLL dd, y')}
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
      <CardHeader className="items-center pb-0">
        <CardTitle>User Types</CardTitle>
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
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={(props) => {
                  // Type guard to check if viewBox has the required properties
                  const viewBox = props.viewBox;
                  if (
                    viewBox &&
                    typeof viewBox === 'object' &&
                    'cx' in viewBox &&
                    'cy' in viewBox &&
                    typeof viewBox.cx === 'number' &&
                    typeof viewBox.cy === 'number'
                  ) {
                    const cx = viewBox.cx;
                    const cy = viewBox.cy;

                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {returningUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy + 24}
                          className="fill-muted-foreground"
                        >
                          Returning Users
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
              {chartData.map((entry) => (
                <Cell
                  key={entry.type}
                  fill={
                    chartConfig[entry.type as keyof typeof chartConfig]?.color
                  }
                />
              ))}
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
        <CardFooter className="flex-col gap-2 pt-6 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing user type data for selected date range
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
