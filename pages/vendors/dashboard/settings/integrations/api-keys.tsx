
import DashboardLayout from '../../layout';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/vendors/page-header';
import { CreateApiKeyButton } from '@/components/vendors/dashboard/settings/integrations/api-keys/create-api-key-button';
import { ApiKeyList } from '@/components/vendors/dashboard/settings/integrations/api-keys/api-key-list';

export default function ApiKeysPage() {
  const { getVendorById } = useVendors();
  const { profile } = useAuth();
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;
  const isAdmin = profile?.data?.user.role === 'ADMIN';
  const vendor = getVendorById(vendorId);

  return (
    <DashboardLayout>
      <main className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6">
          {/* Header section */}
          <PageHeader
            title="API Keys"
            description="API keys provide secure access to the API. Keys are only displayed once when created."
            actionButton={<CreateApiKeyButton />}
          />
          <section className="space-y-4">
            <ApiKeyList />
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
