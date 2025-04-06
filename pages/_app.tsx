// _app.tsx
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  memo,
  useRef
} from 'react';
import React from 'react';

import { AppProps } from 'next/app';
import MainLayout from '@/components/main-page-layout';
import Layout from '@/components/ui/root-layout';
import { initGA, logPageView } from '../utils/analytics';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';
import { Inter } from 'next/font/google';
import { useAuth } from '@/hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdLayout from '@/components/ad-layout';

const inter = Inter({ subsets: ['latin'] });

interface MyAppProps extends AppProps {}

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

// Create QueryClient outside component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

// Memoize the AdProvider
const MemoizedAdProvider = memo(AdProvider);

// Create a route-aware content wrapper
const RouteAwareContent = memo(function RouteAwareContent({
  children,
  pathname
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  // Use pathname as a key to force update when route changes
  return <React.Fragment key={pathname}>{children}</React.Fragment>;
});

function MyApp({ Component, pageProps, router }: MyAppProps) {
  const { width = 0 } = useWindowSize();
  const isVendorDashboardPage =
    router.pathname.startsWith('/vendors/dashboard');
  const isLandingPage =
    router.pathname === '/welcome' || router.pathname === '/vendors/tier3';
  const usesMainNav = !isVendorDashboardPage && !isLandingPage;

  // Create a stable toaster
  const ToasterComponent = useRef(<Toaster position="bottom-right" />).current;

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
          forcedTheme={isLandingPage ? 'light' : undefined}
          disableTransitionOnChange
        >
          {isLandingPage && (
            <>
              {ToasterComponent}
              <RouteAwareContent pathname={router.pathname}>
                <Component {...pageProps} />
              </RouteAwareContent>
            </>
          )}
          {isVendorDashboardPage && (
            <Layout>
              {ToasterComponent}
              <RouteAwareContent pathname={router.pathname}>
                <Component {...pageProps} />
              </RouteAwareContent>
            </Layout>
          )}
          {usesMainNav && (
            <Layout>
              <MemoizedAdProvider>
                <AdLayout>
                  {ToasterComponent}
                  <RouteAwareContent pathname={router.pathname}>
                    <Component {...pageProps} />
                  </RouteAwareContent>
                </AdLayout>
              </MemoizedAdProvider>
            </Layout>
          )}
        </ThemeProvider>
      </main>
    </QueryClientProvider>
  );
}

export default MyApp;
