import {
  AlertCircle,
  TrendingUp,
  CreditCard,
  Coins,
  Package,
  ShoppingCart,
  Star
} from 'lucide-react';
import React from 'react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BuylistAnalytics } from '@/services/catalogService';
import { VendorTier } from '@/services/vendorService';

type Props = {
  data: BuylistAnalytics;
  isLoading: boolean;
  isError: boolean;
};

// Helper function to get tier badge details
const getTierBadgeStyles = (tier?: string) => {
  switch (tier) {
    case VendorTier.TIER_3:
      return {
        variant: 'default' as const,
        className:
          'bg-primary/20 text-foreground hover:bg-primary/40 dark:bg-primary/20 dark:text-foreground',
        icon: <Star className="mr-1 h-3 w-3" />,
        label: 'Tier 3'
      };
    case VendorTier.TIER_2:
      return {
        variant: 'default' as const,
        className:
          'bg-primary/20 text-foreground hover:bg-primary/40 dark:bg-primary/20 dark:text-foreground',
        icon: <Star className="mr-1 h-3 w-3" />,
        label: 'Tier 2'
      };
    case VendorTier.TIER_1:
      return {
        variant: 'default' as const,
        className:
          'bg-primary/20 text-foreground hover:bg-primary/40 dark:bg-primary/20 dark:text-foreground',
        icon: <Star className="mr-1 h-3 w-3" />,
        label: 'Tier 1'
      };
    case VendorTier.FREE:
    default:
      return {
        variant: 'secondary' as const,
        className: '',
        icon: <Star className="mr-1 h-3 w-3" />,
        label: 'Free'
      };
  }
};

const BuylistAnalyticsOverview = ({ data, isLoading, isError }: Props) => {
  if (isLoading) {
    return (
      <Card className="border-border/30 shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Badges Skeleton */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Analytics Section Skeleton */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="border-border/20">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, index) => (
              <Card key={index} className="border-border/20">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading analytics</AlertTitle>
        <AlertDescription>
          There was an error loading the buylist analytics data. Please try
          again later.
        </AlertDescription>
      </Alert>
    );
  }

  const tierBadge = getTierBadgeStyles(data.vendor?.tier);

  return (
    <Card className="border-border/30 shadow-sm animate-in fade-in-50">
      <CardHeader className="pb-3">
        <CardDescription>
          Overview of buylist performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-3">
          <Badge
            variant={data.vendor?.buylist_enabled ? 'default' : 'secondary'}
            className={cn(
              'px-3 py-1 text-xs font-medium',
              data.vendor?.buylist_enabled
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                : ''
            )}
          >
            {data.vendor?.buylist_enabled
              ? 'Buylist Enabled'
              : 'Buylist Disabled'}
          </Badge>

          <Badge
            variant={tierBadge.variant}
            className={cn(
              'flex w-fit items-center px-3 py-1 text-xs font-medium',
              tierBadge.className
            )}
          >
            {tierBadge.icon}
            {tierBadge.label}
          </Badge>
        </div>

        {data.submissionData && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatsCard
                title="Total Value"
                value={`$${
                  data.submissionData.successfulSubmissions?.totalValue?.toFixed(
                    2
                  ) || '0.00'
                }`}
                icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                description="Value of all buylist submissions"
              />

              <StatsCard
                title="Total Cards"
                value={
                  data.submissionData.successfulSubmissions?.totalCards?.toString() ||
                  '0'
                }
                icon={<Package className="h-4 w-4 text-blue-500" />}
                description="Cards submitted to buylist"
              />

              <StatsCard
                title="Total Submissions"
                value={
                  data.submissionData.successfulSubmissions?.totalSubmissions?.toString() ||
                  '0'
                }
                icon={<ShoppingCart className="h-4 w-4 text-purple-500" />}
                description="Number of buylist submissions"
              />
            </div>

            {/* Payment Type Metrics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StatsCard
                title="Cash Submissions"
                value={
                  data.submissionData.successfulSubmissions?.cashSubmissions?.toString() ||
                  '0'
                }
                icon={<Coins className="h-4 w-4 text-amber-500" />}
                description="Submissions for cash payment"
              />

              <StatsCard
                title="Store Credit Submissions"
                value={
                  data.submissionData.successfulSubmissions?.storeCreditSubmissions?.toString() ||
                  '0'
                }
                icon={<CreditCard className="h-4 w-4 text-indigo-500" />}
                description="Submissions for store credit"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Helper component for Stats Cards
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card className="border-border/20 transition-all hover:border-border/60 hover:shadow-sm">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="mt-0.5 text-xs">
            {description}
          </CardDescription>
        )}
      </div>
      <div className="rounded-full bg-muted/30 p-1.5">{icon}</div>
    </CardHeader>
    <CardContent>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </CardContent>
  </Card>
);

export default BuylistAnalyticsOverview;
