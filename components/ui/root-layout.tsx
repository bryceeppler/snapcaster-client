import { usePathname } from 'next/navigation';

import React from 'react';

import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/ui/footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesFooter = pathname
    ? !pathname.includes('buylists') && !pathname.includes('vendors/dashboard')
    : true;

  return (
    <div className="flex flex-col bg-background">
      <div className="min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
      {usesFooter && <Footer />}
    </div>
  );
}
