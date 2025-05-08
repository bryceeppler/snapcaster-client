'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useVendorBuyClicks } from '@/lib/hooks/useAnalytics';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import { ChartSkeleton } from '@/components/vendors/dashboard/chart-skeleton';
import { formatChartDate } from '@/lib/utils';
import { useVendors } from '@/hooks/queries/useVendors';
const TCG_ORDER = [
  'mtg',
  'pokemon',
  'yugioh',
  'onepiece',
  'lorcana',
  'starwars',
  'fleshandblood'
] as const;

const chartConfig = {
  mtg: {
    label: 'Magic: The Gathering',
    color: 'hsl(var(--chart-1))'
  },
  pokemon: {
    label: 'Pokémon',
    color: 'hsl(var(--chart-2))'
  },
  yugioh: {
    label: 'Yu-Gi-Oh!',
    color: 'hsl(var(--chart-3))'
  },
  onepiece: {
    label: 'One Piece',
    color: 'hsl(var(--chart-4))'
  },
  lorcana: {
    label: 'Lorcana',
    color: 'hsl(var(--chart-5))'
  },
  starwars: {
    label: 'Star Wars',
    color: 'hsl(var(--chart-6))'
  },
  fleshandblood: {
    label: 'Flesh and Blood',
    color: 'hsl(var(--chart-7))'
  }
} satisfies ChartConfig;

// Define types for chart payload
interface VendorPayload {
  website: string;
  mtg: number;
  pokemon: number;
  yugioh: number;
  onepiece: number;
  lorcana: number;
  fleshandblood: number;
  starwars: number;
  total: number;
  rank: number;
  vendor: string;
  originalUrl: string;
}

interface ChartTooltipPayloadItem {
  fill: string;
  radius: number;
  dataKey: string;
  name: string;
  color: string;
  value: number;
  payload: VendorPayload;
  hide: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  const totalClicks = data.total;

  // Create a type for the TCG data items
  type TcgDataItem = {
    tcg: (typeof TCG_ORDER)[number];
    clicks: number;
    percentage: number;
  };

  // Sort TCGs by number of clicks
  const tcgData: TcgDataItem[] = TCG_ORDER.map((tcg) => ({
    tcg,
    clicks: data[tcg],
    percentage: (data[tcg] / totalClicks) * 100
  }))
    .filter((item) => item.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="mb-2">
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">
          {totalClicks.toLocaleString()} total clicks
        </div>
      </div>
      <div className="grid gap-1.5">
        {tcgData.map(({ tcg, clicks, percentage }) => (
          <div key={tcg} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: chartConfig[tcg].color }}
            />
            <span className="text-sm text-muted-foreground">
              {chartConfig[tcg].label}:
            </span>
            <span className="text-sm font-medium">
              {clicks.toLocaleString()} ({percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeWebsiteUrl(url: string): string {
  // Remove common prefixes and suffixes
  let hostname = url
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove http://, https://, www.
    .replace(/\.(com|ca|net|org|io).*$/, ''); // Remove .com, .ca, etc and anything after

  if (hostname === 'store.401games') {
    hostname = '401games';
  }

  return hostname;
}

interface CustomXAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const CustomXAxisTick = ({ x, y, payload }: CustomXAxisTickProps) => {
  // Split long names into multiple lines
  const words = payload.value.split(' ');
  const maxWordsPerLine = 2;
  const lines: string[] = [];

  for (let i = 0; i < words.length; i += maxWordsPerLine) {
    lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
  }

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 12} // Adjust line height
          dy={12}
          textAnchor="middle"
          fill="currentColor"
          fontSize={12}
          className="text-muted-foreground"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

interface VendorBuyClicksChartProps {
  numberOfDays?: number;
  chartHeight?: number | string;
  className?: string;
}

export function VendorBuyClicksChart({
  numberOfDays = 30,
  chartHeight = 250,
  className
}: VendorBuyClicksChartProps) {
  const { data, isLoading, error } = useVendorBuyClicks(numberOfDays);
  const { vendors } = useVendors();

  // Convert chartHeight to a string with 'px' if it's a number
  const heightClass =
    typeof chartHeight === 'number' ? `h-[${chartHeight}px]` : chartHeight;

  if (isLoading) {
    return (
      <ChartSkeleton
        title="Top Vendors"
        height={chartHeight as number}
        description="Buy clicks by TCG across vendors"
        footer={true}
      />
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="items-center pb-0">
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </CardHeader>
        <CardContent
          className={`flex items-center justify-center ${heightClass}`}
        >
          <p className="text-sm text-red-500">Failed to load vendor data</p>
        </CardContent>
      </Card>
    );
  }

  const startDate = data?.startDate ? formatChartDate(data.startDate) : '';
  const endDate = data?.endDate ? formatChartDate(data.endDate) : '';

  // Process the data to use proper website names
  const processedData: VendorPayload[] =
    data?.data.map((item) => {
      const normalizedUrl = normalizeWebsiteUrl(item.website);
      const vendor = vendors.find(
        (v) => normalizeWebsiteUrl(v.url) === normalizedUrl
      );
      return {
        ...item,
        vendor: vendor?.name || normalizedUrl, // Fallback to normalized URL if website not found
        originalUrl: item.website // Keep original URL for tooltip
      };
    }) || [];

  return (
    <Card className={className}>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className={`aspect-auto ${heightClass} w-full`}
        >
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="vendor"
              tickLine={false}
              axisLine={false}
              tick={(props: CustomXAxisTickProps) => (
                <CustomXAxisTick {...props} />
              )}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              minTickGap={40}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-2 text-sm">
        <div className="h-[16px] leading-none opacity-0">
          {/* This invisible element maintains the same height as the trend indicator in TrafficChart */}
          Placeholder for alignment
        </div>
        <div className="leading-none text-muted-foreground">
          {startDate} - {endDate}
        </div>
      </CardFooter>
    </Card>
  );
}
