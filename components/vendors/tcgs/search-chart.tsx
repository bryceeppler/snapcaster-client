'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import {
  Line,
  LineChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { useSearchQueriesWithParams } from '@/lib/hooks/useAnalytics';

function formatDate(dateString: string) {
  // GA4 returns dates in YYYYMMDD format
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return format(parseISO(`${year}-${month}-${day}`), 'MMM d');
}

// Define TCG colors
const tcgColors = {
  mtg: 'hsl(var(--chart-1))',
  pokemon: 'hsl(var(--chart-2))',
  yugioh: 'hsl(var(--chart-3))',
  onepiece: 'hsl(var(--chart-4))',
  lorcana: 'hsl(var(--chart-5))',
  starwars: 'hsl(var(--chart-6))',
  fleshandblood: 'hsl(var(--chart-7))'
};

// Create chart config
const chartConfig = {
  mtg: {
    label: 'Magic: The Gathering',
    color: tcgColors.mtg
  },
  pokemon: {
    label: 'Pokémon',
    color: tcgColors.pokemon
  },
  yugioh: {
    label: 'Yu-Gi-Oh!',
    color: tcgColors.yugioh
  },
  onepiece: {
    label: 'One Piece',
    color: tcgColors.onepiece
  },
  lorcana: {
    label: 'Lorcana',
    color: tcgColors.lorcana
  },
  starwars: {
    label: 'Star Wars',
    color: tcgColors.starwars
  },
  fleshandblood: {
    label: 'Flesh and Blood',
    color: tcgColors.fleshandblood
  }
} satisfies ChartConfig;

interface SearchChartProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  tcgFilter?: string[];
  title?: string;
  chartHeight?: number | string;
}

export function SearchChart({ 
  dateRange, 
  tcgFilter, 
  title = "TCG Search Trends",
  chartHeight = 200 
}: SearchChartProps) {
  const { data, isLoading, error } = useSearchQueriesWithParams(
    dateRange.from,
    dateRange.to
  );

  // Convert chartHeight to a string with 'px' if it's a number
  const heightClass = typeof chartHeight === 'number' ? `h-[${chartHeight}px]` : chartHeight;

  if (isLoading) {
    return <ChartSkeleton title={title} dateRange={dateRange} height={chartHeight as number} />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load search data: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Process data for the chart
  const chartData = data?.data.map((item) => {
    const formattedDate = formatDate(item.date);
    
    // Start with the date
    const dataPoint: any = { date: formattedDate };
    
    // Add each TCG's search count
    Object.entries(item.tcgs).forEach(([tcg, count]) => {
      // Only include TCGs that are in our config AND in the tcgFilter (if provided)
      if (tcg in chartConfig && (!tcgFilter || tcgFilter.includes(tcg))) {
        dataPoint[tcg] = count;
      }
    });
    
    return dataPoint;
  }) ?? [];

  // Get the list of TCGs that have data and are in the filter
  const activeTcgs = Object.keys(chartConfig).filter(tcg => 
    (!tcgFilter || tcgFilter.includes(tcg)) && 
    chartData.some(dataPoint => dataPoint[tcg] !== undefined)
  );

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer 
          config={chartConfig} 
          className={`aspect-auto ${heightClass} w-full`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {activeTcgs.map(tcg => (
                  <linearGradient key={tcg} id={`fill${tcg}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={`var(--color-${tcg})`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`var(--color-${tcg})`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={64}
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
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => value}
                    indicator="dot"
                  />
                }
              />
              <Legend />
              {activeTcgs.map(tcg => (
                <Area
                  key={tcg}
                  type="monotone"
                  dataKey={tcg}
                  name={chartConfig[tcg as keyof typeof chartConfig].label}
                  stroke={`var(--color-${tcg})`}
                  fill={`url(#fill${tcg})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
