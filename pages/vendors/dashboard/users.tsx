import {
  BarChart3,
  LineChart,
  Users,
  LucideIcon,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useState } from 'react';
import { type PropsRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { TrafficChart } from '@/components/vendors/users/traffic-chart';
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
  useEngagementTime
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
  const engagementTime = useEngagementTime(dateRange.from, dateRange.to);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${Math.round(seconds % 60)}s`;
  };

  const metrics = [
    {
      title: 'Unique Users',
      Icon: Users,
      value: uniqueUsers.data?.totalUniqueUsers ?? 0,
      percentageChange: uniqueUsers.data?.percentageChange,
      isLoading: uniqueUsers.isLoading,
      error: uniqueUsers.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`
    },
    {
      title: 'Average Daily Users',
      Icon: BarChart3,
      value: uniqueUsers.data?.averageDailyUsers ?? 0,
      percentageChange: uniqueUsers.data?.percentageChange,
      isLoading: uniqueUsers.isLoading,
      error: uniqueUsers.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`
    },
    {
      title: 'Avg. Engagement Time',
      Icon: LineChart,
      value: engagementTime.data?.averageEngagementTime ?? 0,
      percentageChange: engagementTime.data?.percentageChange,
      isLoading: engagementTime.isLoading,
      error: engagementTime.error,
      description: `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`,
      formatter: formatTime
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

export default function UserAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const { isAdmin } = useAuth();

  const handleDateRangeChange: PropsRange['onSelect'] = (range) => {
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
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              User Analytics
            </h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-full justify-start bg-card text-left font-normal md:w-auto"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={1}
                  className="md:hidden"
                />
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="hidden md:block"
                />
              </PopoverContent>
            </Popover>
          </div>
          <AnalyticsMetrics dateRange={dateRange} />
          <div className="overflow-x-auto">
            <TrafficChart dateRange={dateRange} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <UserDeviceAreaChart dateRange={dateRange} />
            </div>
            <div className="xl:col-span-1">
              <UserDeviceChart dateRange={dateRange} />
            </div>
            <div className="xl:col-span-1">
              <UserTypesChart dateRange={dateRange} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <CityAnalyticsTable dateRange={dateRange} />
            <TrafficSourcesChart dateRange={dateRange} />
          </div>
          {/* {isAdmin && (
            <div className="overflow-x-auto max-w-full">
              <UserRetentionChart dateRange={dateRange} />
            </div>
          )} */}
        </div>
      </div>
    </DashboardLayout>
  );
}
