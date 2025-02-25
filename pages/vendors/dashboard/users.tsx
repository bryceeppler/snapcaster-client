import { ArrowRight, BarChart3, LineChart, Users, LucideIcon, Calendar as CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { type SelectRangeEventHandler } from "react-day-picker"
import { subDays, format } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrafficChart } from "@/components/vendors/users/traffic-chart"
import { UserDeviceChart } from "@/components/vendors/dashboard/user-device-chart"
import { CityAnalyticsTable } from "@/components/vendors/users/city-analytics-table"
import { UserTypesChart } from "@/components/vendors/users/user-types-chart"
import { TrafficSourcesChart } from "@/components/vendors/users/traffic-sources-chart"
import { AnalyticsCardSkeleton } from "@/components/vendors/dashboard/analytics-card-skeleton"
import DashboardLayout from "./layout"
import { 
  useUniqueUsers, 
  useSearchQueries, 
  useBuyClicks,
  type AnalyticsError,
  useUniqueUsersByDate,
  useEngagementTime
} from "@/lib/hooks/useAnalytics"
import { VendorBuyClicksChart } from "@/components/vendors/dashboard/vendor-buy-clicks-chart"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserRetentionChart } from "@/components/vendors/users/user-retention-chart"

const formatPercentageChange = (change: number | undefined) => {
  if (change === undefined) return '';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change}% from last month`;
};

interface AnalyticsErrorMessageProps {
  message: string;
  status?: number;
}

function AnalyticsErrorMessage({ message, status }: AnalyticsErrorMessageProps) {
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
  description = "Last 30 days",
  formatter = (value: number) => value.toLocaleString()
}: MetricCardProps) {
  if (isLoading) return <AnalyticsCardSkeleton />;


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {error ? (
          <AnalyticsErrorMessage message={error.message} status={error.status} />
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {formatter(value)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface QuickLinkCardProps {
  href: string;
  title: string;
  description: string;
}

function QuickLinkCard({ href, title, description }: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

function AnalyticsMetrics({ dateRange }: { dateRange: { from: Date; to: Date } }) {
  const uniqueUsers = useUniqueUsersByDate(dateRange.from, dateRange.to);
  const engagementTime = useEngagementTime(dateRange.from, dateRange.to);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${Math.round(seconds % 60)}s`;
  };

  const metrics = [
    {
      title: "Unique Users",
      Icon: Users,
      value: uniqueUsers.data?.totalUniqueUsers ?? 0,
      percentageChange: uniqueUsers.data?.percentageChange,
      isLoading: uniqueUsers.isLoading,
      error: uniqueUsers.error,
      description: `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
    },
    {
      title: "Average Daily Users",
      Icon: BarChart3,
      value: uniqueUsers.data?.averageDailyUsers ?? 0,
      percentageChange: uniqueUsers.data?.percentageChange,
      isLoading: uniqueUsers.isLoading,
      error: uniqueUsers.error,
      description: `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
    },
    {
      title: "Avg. Engagement Time",
      Icon: LineChart,
      value: engagementTime.data?.averageEngagementTime ?? 0,
      percentageChange: engagementTime.data?.percentageChange,
      isLoading: engagementTime.isLoading,
      error: engagementTime.error,
      description: `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`,
      formatter: formatTime
    },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
}

function ChartSection({ dateRange }: { dateRange: { from: Date; to: Date } }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TrafficChart dateRange={dateRange} />
      <UserDeviceChart dateRange={dateRange} />
      <UserTypesChart dateRange={dateRange} />
      <TrafficSourcesChart dateRange={dateRange} />
      <div className="md:col-span-2">
        <UserRetentionChart dateRange={dateRange} />
      </div>
    </div>
  );
}

export default function UserAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

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
            <h2 className="text-3xl font-bold tracking-tight">User Analytics</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto h-8 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
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
          <ChartSection dateRange={dateRange} />
          <CityAnalyticsTable dateRange={dateRange} />
        </div>
      </div>
    </DashboardLayout>
  );
}

