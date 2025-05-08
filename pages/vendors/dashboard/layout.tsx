import type React from 'react';
import { Lock } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { VendorSidebar } from '@/components/vendors/sidebar';
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isVendor } = useAuth();

  if (!isAdmin && !isVendor) {
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
    <div className="w-full">
      <VendorSidebar />
      <main className="lg:ml-[280px]">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
