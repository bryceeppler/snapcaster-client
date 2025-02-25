'use client';

import { format, parseISO } from 'date-fns';
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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip
} from '@/components/ui/chart';
import useGlobalStore from '@/stores/globalStore';
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  const totalClicks = data.total;

  // Sort TCGs by number of clicks
  const tcgData = TCG_ORDER.map((tcg) => ({
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
}

export function VendorBuyClicksChart({
  numberOfDays = 30
}: VendorBuyClicksChartProps) {
  const { data, isLoading, error } = useVendorBuyClicks(numberOfDays);
  const { websites } = useGlobalStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[350px] items-center justify-center">
          <LoadingSpinner size={40} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Vendors</CardTitle>
          <CardDescription>Buy clicks by TCG across vendors</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[350px] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load vendor data</p>
        </CardContent>
      </Card>
    );
  }

  const startDate = data?.startDate
    ? format(parseISO(data.startDate), 'MMM d, yyyy')
    : '';
  const endDate = data?.endDate
    ? format(parseISO(data.endDate), 'MMM d, yyyy')
    : '';

  // Process the data to use proper website names
  const processedData = data?.data.map((item) => {
    const normalizedUrl = normalizeWebsiteUrl(item.website);
    const website = websites.find(
      (w) => normalizeWebsiteUrl(w.url) === normalizedUrl
    );
    return {
      ...item,
      website: website?.name || normalizedUrl, // Fallback to normalized URL if website not found
      originalUrl: item.website // Keep original URL for tooltip
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Vendors</CardTitle>
        <CardDescription>Buy clicks by TCG across vendors</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
          >
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="website"
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
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="hsl(var(--primary) / 0.8)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {startDate} - {endDate}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
