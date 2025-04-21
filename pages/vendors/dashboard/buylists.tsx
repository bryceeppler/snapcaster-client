import DashboardLayout from './layout';
import { useBuylistAnalytics } from '@/hooks/queries/useBuylistAnalytics';
import { useAuth } from '@/hooks/useAuth';
import BuylistAnalyticsOverview from '@/components/vendors/dashboard/buylists/buylist-analytics';
export default function BuylistsPage() {
  const { profile } = useAuth();
  // Use the vendor ID from the user profile if available, otherwise default to 26
  const vendorId = profile?.data?.user.vendorData?.vendorId || 26;

  const { buylistAnalytics, isLoading, isError } = useBuylistAnalytics(
    vendorId.toString()
  );

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Buylist Analytics
            </h2>
          </div>
          {buylistAnalytics ? (
            <BuylistAnalyticsOverview
              data={buylistAnalytics}
              isLoading={isLoading}
              isError={isError}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
