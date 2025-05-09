'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect } from 'react';

import { AccountSidebar } from '@/components/account/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';

export default function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isInitializing, router]);

  // Show a loading state while checking authentication
  if (isInitializing) {
    return (
      <div className="w-full p-4 md:p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
          <div className="mt-6 grid gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated and not initializing, don't render anything as we're redirecting
  if (!isAuthenticated && !isInitializing) {
    return null;
  }

  // If authenticated, show the account layout
  return (
    <div className="w-full">
      <AccountSidebar />
      <main className="lg:ml-[280px]">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
