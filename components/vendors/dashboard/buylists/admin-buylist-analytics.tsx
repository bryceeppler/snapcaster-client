import {
  AlertCircle,
  TrendingUp,
  CreditCard,
  Coins,
  Package,
  ShoppingCart
} from 'lucide-react';
import React from 'react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { BuylistAnalytics } from '@/services/catalogService';

type Props = {
  data: BuylistAnalytics;
  isLoading: boolean;
  isError: boolean;
};

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

// Reusable stats card component
const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card className="border-border/20">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {icon}
    </CardHeader>
    <CardContent className="space-y-1">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const AdminBuylistAnalyticsOverview = ({ data, isLoading, isError }: Props) => {
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

  return (
    <Card className="border-border/30 shadow-sm animate-in fade-in-50">
      <CardHeader className="pb-3">
        <CardDescription>{data.vendor.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vendor Status Info */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
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

          <span className="text-xs text-muted-foreground">
            Vendor ID: {data.vendor.id}
          </span>
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

export default AdminBuylistAnalyticsOverview;
