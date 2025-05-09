import { Key } from 'lucide-react';
import { useRouter } from 'next/router';

import DashboardLayout from '../../layout';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { PageHeader } from '@/components/vendors/page-header';
export default function IntegrationsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <main className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6">
          {/* Header section */}
          <PageHeader title="Integrations" />

          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* API Keys Card */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>
                  Manage API keys for programmatic access to our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Create, view, and revoke API keys for secure access to our API
                  endpoints. Use these keys to build custom integrations with
                  your systems.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(
                      '/vendors/dashboard/settings/integrations/api-keys'
                    )
                  }
                >
                  Manage API Keys
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
