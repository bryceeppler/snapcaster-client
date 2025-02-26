import {
  BarChart3,
  LineChart,
  Users,
  LucideIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useState } from 'react';
import { type SelectRangeEventHandler } from 'react-day-picker';
import { subDays, format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TrafficChart } from '@/components/vendors/users/traffic-chart';
import { SearchChart } from '@/components/vendors/tcgs/search-chart';
import { BuyClicksChart } from '@/components/vendors/tcgs/buy-clicks-chart';
import { UserDeviceChart } from '@/components/vendors/dashboard/user-device-chart';
import { UserDeviceAreaChart } from '@/components/vendors/users/user-device-area-chart';
import { CityAnalyticsTable } from '@/components/vendors/users/city-analytics-table';
import { UserTypesChart } from '@/components/vendors/users/user-types-chart';
import { TrafficSourcesChart } from '@/components/vendors/users/traffic-sources-chart';
import DashboardLayout from './layout';
import { useAuth } from '@/hooks/useAuth';
import {
  type AnalyticsError,
  useUniqueUsersByDate,
  useEngagementTime,
  useSearchQueries,
  useSearchQueriesWithParams,
  useBuyClicksWithParams
} from '@/lib/hooks/useAnalytics';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { UserRetentionChart } from '@/components/vendors/users/user-retention-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { PopularClickedCards } from '@/components/vendors/tcgs/popular-clicked-cards';
import { PopularClickedSets } from '@/components/vendors/tcgs/popular-clicked-sets';

interface AnalyticsErrorMessageProps {
  message: string;
  status?: number;
}

function AnalyticsErrorMessage({
  message,
  status
}: AnalyticsErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <p className="text-sm text-red-500">{message}</p>
      {status && <p className="text-xs text-red-400">Status: {status}</p>}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  Icon: LucideIcon;
  value: number;
  isLoading: boolean;
  error: AnalyticsError | null | undefined;
  description?: string;
  formatter?: (value: number) => string;
}

function MetricCard({
  title,
  Icon,
  value,
  isLoading,
  error,
  description = 'Last 30 days',
  formatter = (value: number) => value.toLocaleString()
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-[120px]" />
        ) : error ? (
          <AnalyticsErrorMessage
            message={error.message}
            status={error.status}
          />
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatter(value)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AnalyticsMetrics({
  dateRange
}: {
  dateRange: { from: Date; to: Date };
}) {
  const uniqueUsers = useUniqueUsersByDate(dateRange.from, dateRange.to);
  const searchQueries = useSearchQueriesWithParams(
    dateRange.from,
    dateRange.to
  );
  const engagementTime = useEngagementTime(dateRange.from, dateRange.to);
  const buyClicks = useBuyClicksWithParams(dateRange.from, dateRange.to);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${Math.round(seconds % 60)}s`;
  };

  const metrics = [
    {
      title: 'Searches',
      Icon: Users,
      value: searchQueries.data?.totalSearches ?? 0,
      isLoading: searchQueries.isLoading,
      error: searchQueries.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`
    },
    {
      title: 'Buy Clicks',
      Icon: BarChart3,
      value: buyClicks.data?.totalBuyClicks ?? 0,
      isLoading: buyClicks.isLoading,
      error: buyClicks.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`
    },
    {
      title: 'Avg. Daily Searches',
      Icon: LineChart,
      value: searchQueries.data?.averageDailySearches ?? 0,
      isLoading: searchQueries.isLoading,
      error: searchQueries.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`
    }
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

export default function TCGAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { isAdmin } = useAuth();

  const handleDateRangeChange: SelectRangeEventHandler = (range) => {
    if (!range) {
      setDateRange({ from: subDays(new Date(), 30), to: new Date() });
      return;
    }
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">TCG Analytics</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto h-8 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <AnalyticsMetrics dateRange={dateRange} />
          <div className="grid gap-4 xl:grid-cols-2">
            <SearchChart
              dateRange={dateRange}
              tcgFilter={['mtg']}
              title="Magic: The Gathering Search Trends"
            />
            <BuyClicksChart
              dateRange={dateRange}
              tcgFilter={['mtg']}
              title="Magic: The Gathering Buy Clicks"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <SearchChart
              dateRange={dateRange}
              tcgFilter={[
                'pokemon',
                'yugioh',
                'onepiece',
                'lorcana',
                'starwars',
                'fleshandblood'
              ]}
              title="Other TCG Search Trends"
            />

            <BuyClicksChart
              dateRange={dateRange}
              tcgFilter={[
                'pokemon',
                'yugioh',
                'onepiece',
                'lorcana',
                'starwars',
                'fleshandblood'
              ]}
              title="Other TCG Buy Clicks"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <PopularClickedCards dateRange={dateRange} />
            <PopularClickedSets dateRange={dateRange} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
