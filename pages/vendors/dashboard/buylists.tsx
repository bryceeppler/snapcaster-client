import DashboardLayout from './layout';
import { useBuylistAnalytics } from '@/hooks/queries/useBuylistAnalytics';
import { useAuth } from '@/hooks/useAuth';
import BuylistAnalyticsOverview from '@/components/vendors/dashboard/buylists/buylist-analytics';
import AdminBuylistAnalyticsOverview from '@/components/vendors/dashboard/buylists/admin-buylist-analytics';
import { BuylistAnalytics } from '@/services/catalogService';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
export default function BuylistsPage() {
  const { profile, isAdmin, isLoadingProfile } = useAuth();

  // State to track selected vendor index (for admin view only)
  const [selectedVendorIndex, setSelectedVendorIndex] = useState<number>(0);

  // Determine role only after profile is loaded
  const userRole =
    !isLoadingProfile && profile?.data?.user.role
      ? profile.data.user.role
      : null;

  // Use the vendor ID from the user profile if available, otherwise default to 26
  const vendorId = profile?.data?.user.vendorData?.vendorId || 26;

  const { buylistAnalytics, isLoading, isError, isRolePending } =
    useBuylistAnalytics(vendorId.toString(), userRole);

  // For admins, determine which vendor data to display
  const analyticsToDisplay: BuylistAnalytics | undefined =
    buylistAnalytics && buylistAnalytics.length > 0
      ? isAdmin
        ? buylistAnalytics[selectedVendorIndex]
        : buylistAnalytics[0]
      : undefined;

  // Handle vendor selection change (admin only)
  const handleVendorChange = (value: string) => {
    setSelectedVendorIndex(parseInt(value));
  };

  // Determine if we're in a loading state
  const isLoadingData = isLoadingProfile || isRolePending || isLoading;

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Buylist Analytics
              {isAdmin && (
                <Badge className="ml-2 bg-primary/10 text-primary">Admin</Badge>
              )}
            </h2>

            {/* Vendor selector for admin users */}
            {isAdmin && buylistAnalytics && buylistAnalytics.length > 0 && (
              <div className="w-full md:w-[250px]">
                <Select
                  value={selectedVendorIndex.toString()}
                  onValueChange={handleVendorChange}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {buylistAnalytics.map((analytics, index) => (
                      <SelectItem
                        key={analytics.vendor.id}
                        value={index.toString()}
                      >
                        {analytics.vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {isLoadingData ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          ) : isError ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-red-500">Error loading analytics data</p>
            </div>
          ) : analyticsToDisplay ? (
            <>
              {isAdmin ? (
                <AdminBuylistAnalyticsOverview
                  data={analyticsToDisplay}
                  isLoading={isLoading}
                  isError={isError}
                />
              ) : (
                <BuylistAnalyticsOverview
                  data={analyticsToDisplay}
                  isLoading={isLoading}
                  isError={isError}
                />
              )}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
