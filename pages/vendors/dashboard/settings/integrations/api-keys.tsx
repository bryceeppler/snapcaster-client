import DashboardLayout from '../../layout';

import { ApiKeyList } from '@/components/vendors/dashboard/settings/integrations/api-keys/api-key-list';
import { CreateApiKeyButton } from '@/components/vendors/dashboard/settings/integrations/api-keys/create-api-key-button';
import { PageHeader } from '@/components/vendors/page-header';

export default function ApiKeysPage() {
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
