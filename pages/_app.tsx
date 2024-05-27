import { useEffect } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/ui/root-layout';
import { initGA, logPageView } from '../utils/analytics';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  const { width = 0, height = 0 } = useWindowSize();
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      initGA();
      logPageView();
    } else {
      initGA();
    }
  }, []);

  return (
    <main className={cn('antialiased', inter.className)}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Layout>
          <Toaster position={width > 640 ? 'bottom-center' : 'bottom-right'} />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </main>
  );
}
