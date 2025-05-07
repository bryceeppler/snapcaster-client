import React from 'react';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/ui/footer';
import { usePathname } from 'next/navigation';
type Props = {};

export default function Layout({ children }: React.PropsWithChildren<Props>) {
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
