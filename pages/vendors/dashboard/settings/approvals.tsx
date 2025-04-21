import React from 'react';
import DashboardLayout from '../layout';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import ApprovalTable from '@/components/vendors/dashboard/settings/approvals/approval-table';
export default function AdvertisementsPage() {
  const { profile } = useAuth();

  const isAdmin = profile?.data?.user.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Lock className="h-10 w-10 text-primary" />
          <p className="text-sm text-muted-foreground">
            You are not authorized to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col bg-card dark:bg-transparent">
        <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Advertisement Approvals
                {isAdmin && (
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    Admin
                  </Badge>
                )}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Approve or reject pending advertisements from vendors
              </p>
            </div>
          </div>
          <ApprovalTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
