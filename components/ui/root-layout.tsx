import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';

type Props = {};

export default function Layout({ children }: React.PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col bg-background">
      <div className="min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
