'use client';

import {
  CreditCard,
  DollarSign,
  Package,
  Settings,
  Store,
  TrendingUp
} from 'lucide-react';

import { OnboardingProgress } from '@/components/account/marketplace/merchant/onboarding/onboarding-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DashboardMetric {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ComponentType<any>;
}

function MerchantDashboard() {
  // Mock data - replace with actual data from your API

  const dashboardMetrics: DashboardMetric[] = [
    {
      title: 'Total Orders',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Package
    },
    {
      title: 'Revenue This Month',
      value: '$2,847.32',
      change: '+23%',
      changeType: 'positive',
      icon: DollarSign
    },
    {
      title: 'Active Listings',
      value: '156',
      change: '+3',
      changeType: 'positive',
      icon: Store
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      changeType: 'negative',
      icon: TrendingUp
    }
  ];

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Merchant Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your marketplace performance.
        </p>
      </div>

      {/* Onboarding Progress */}
      <OnboardingProgress />

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <p
                    className={`text-xs ${
                      metric.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {metric.change} from last month
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto justify-start py-4">
              <Package className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Manage Inventory</div>
                <div className="text-sm text-muted-foreground">
                  Add or update products
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4">
              <CreditCard className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Payment Settings</div>
                <div className="text-sm text-muted-foreground">
                  Manage payouts and fees
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto justify-start py-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">View Analytics</div>
                <div className="text-sm text-muted-foreground">
                  Detailed performance reports
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order #1234 received</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">$24.99</Badge>
            </div>
            <Separator />
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Store className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Product "Magic Card Pack" was updated
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Payout of $156.78 processed
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MerchantDashboard;
