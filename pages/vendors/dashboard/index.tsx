import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BarChart3, LineChart, Users } from 'lucide-react';
import Link from 'next/link';

import DashboardLayout from './layout';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrafficChart } from '@/components/vendors/dashboard/traffic-chart';
import { VendorBuyClicksChart } from '@/components/vendors/dashboard/vendor-buy-clicks-chart';
import {
  useBuyClicks,
  useSearchQueries,
  useUniqueUsers,
  type AnalyticsError
} from '@/lib/hooks/useAnalytics';
interface AnalyticsErrorMessageProps {
  message: string;
  status?: number | undefined;
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
  percentageChange?: number | undefined;
  isLoading: boolean;
  error: AnalyticsError | null | undefined;
  description?: string;
}

function MetricCard({
  title,
  Icon,
  value,
  percentageChange,
  isLoading,
  error,
  description = 'Last 30 days'
}: MetricCardProps) {
  const isPositiveChange =
    percentageChange !== undefined && percentageChange >= 0;

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
        {error ? (
          <AnalyticsErrorMessage
            message={error.message}
            status={error.status}
          />
        ) : isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-5 w-[120px]" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            {percentageChange !== undefined && (
              <div
                className={`flex items-center text-sm ${
                  isPositiveChange ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <span className="flex items-center">
                  {isPositiveChange ? '↑' : '↓'} {Math.abs(percentageChange)}%
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  vs. previous period
                </span>
              </div>
            )}
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
      <Card className="transition-colors hover:bg-muted/50">
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

function AnalyticsMetrics() {
  const uniqueUsers = useUniqueUsers(30);
  const searchQueries = useSearchQueries(30);
  const buyClicks = useBuyClicks(30);

  const metrics = [
    {
      title: 'Unique Users',
      Icon: Users,
      value: uniqueUsers.data?.totalUniqueUsers ?? 0,
      percentageChange: uniqueUsers.data?.percentageChange,
      isLoading: uniqueUsers.isLoading,
      error: uniqueUsers.error,
      description: 'Unique visitors in the last 30 days'
    },
    {
      title: 'Total Searches',
      Icon: BarChart3,
      value: searchQueries.data?.totalSearches ?? 0,
      percentageChange: searchQueries.data?.percentageChange,
      isLoading: searchQueries.isLoading,
      error: searchQueries.error,
      description: 'Card searches in the last 30 days'
    },
    {
      title: 'Buy Clicks',
      Icon: LineChart,
      value: buyClicks.data?.totalClicks ?? 0,
      percentageChange: buyClicks.data?.percentageChange,
      isLoading: buyClicks.isLoading,
      error: buyClicks.error,
      description: 'Purchase clicks in the last 30 days'
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

function ChartSection() {
  // Define consistent chart dimensions
  const chartHeight = 250;
  const chartClassName = 'h-full'; // Make cards take full height of grid cell

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <TrafficChart chartHeight={chartHeight} className={chartClassName} />
      <VendorBuyClicksChart
        chartHeight={chartHeight}
        className={chartClassName}
      />
    </div>
  );
}

function QuickLinks() {
  const links = [
    {
      href: '/vendors/dashboard/users',
      title: 'User Analytics',
      description: 'Detailed user behavior and demographics'
    },
    {
      href: '/vendors/dashboard/tcgs',
      title: 'TCG Metrics',
      description: 'Page load times and core web vitals'
    },
    {
      href: '/vendors/dashboard/vendors',
      title: 'Vendor Leaderboard',
      description: 'View your competitors and their performance'
    }
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {links.map((link) => (
        <QuickLinkCard key={link.href} {...link} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            {' '}
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Analytics Overview
            </h2>
          </div>
          <AnalyticsMetrics />
          <ChartSection />
          <QuickLinks />
        </div>
      </div>
    </DashboardLayout>
  );
}
