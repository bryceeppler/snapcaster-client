// _app.tsx
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import React from 'react';
import 'styles/chrome-bug.css';
import 'styles/main.css';
import { useWindowSize } from 'usehooks-ts';

import { initGA, logPageView } from '../utils/analytics';

import MainLayout from '@/components/main-page-layout';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/ui/root-layout';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

type AdContextType = {
  showAds: boolean;
  setShowAds: (value: boolean) => void;
};

const AdContext = createContext<AdContextType | undefined>(undefined);

export const useAdContext = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
};

interface AdProviderProps {
  children: ReactNode;
}

const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [showAds, setShowAds] = useState(true);
  const { hasActiveSubscription } = useAuth();

  useEffect(() => {
    if (hasActiveSubscription) {
      setShowAds(false);
    }
  }, [hasActiveSubscription]);
  return (
    <AdContext.Provider value={{ showAds, setShowAds }}>
      {children}
    </AdContext.Provider>
  );
};

function MyApp({ Component, pageProps, router }: AppProps) {
  const { width = 0 } = useWindowSize();
  const isVendorDashboardPage =
    router.pathname.startsWith('/vendors/dashboard');
  const isLandingPage =
    router.pathname === '/welcome' || router.pathname === '/vendors/tier3';
  const isBuylistsPage = router.pathname.startsWith('/buylists');
  const usesMainNav =
    !isVendorDashboardPage && !isLandingPage && !isBuylistsPage;

  const usesSideBanners = !isBuylistsPage;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false
          }
        }
      })
  );

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
    <QueryClientProvider client={queryClient}>
      <main className={cn('antialiased', inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme={!isLandingPage ? 'light' : 'system'}
          enableSystem={!isLandingPage}
          {...(isLandingPage ? { forcedTheme: 'light' } : {})}
          disableTransitionOnChange
        >
          <AdProvider>
            {isLandingPage && (
              <>
                <Toaster
                  position={width > 640 ? 'bottom-center' : 'bottom-right'}
                />
                <Component {...pageProps} />
              </>
            )}
            {(isVendorDashboardPage || isBuylistsPage) && (
              <Layout>
                <Toaster
                  position={width > 640 ? 'bottom-center' : 'bottom-right'}
                />
                <Component {...pageProps} />
              </Layout>
            )}
            {usesMainNav && (
              <Layout>
                <MainLayout usesSideBanners={usesSideBanners}>
                  <Toaster
                    position={width > 640 ? 'bottom-center' : 'bottom-right'}
                  />
                  <Component {...pageProps} />
                </MainLayout>
              </Layout>
            )}
          </AdProvider>
        </ThemeProvider>
      </main>
    </QueryClientProvider>
  );
}

export default MyApp;
