import type { Metadata } from 'next';
import '../styles/main.css';
import { Inter } from 'next/font/google';

import Navbar from '@/components/navigation/navbar';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Snapcaster - Search Magic the Gathering cards across Canada',
  description:
    'Find Magic the Gathering singles and sealed product using Snapcaster. Search your favourite Canadian stores.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
