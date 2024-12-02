// _app.tsx
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode
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
import useAuthStore from '@/stores/authStore';

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
  const { hasActiveSubscription } = useAuthStore();

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

function MyApp({ Component, pageProps, router }: MyAppProps) {
  const { width = 0 } = useWindowSize();
  const isWelcomePage = router.pathname === '/welcome';

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
        defaultTheme="system"
        enableSystem
      >
        {isWelcomePage ? (
          <>
            <Toaster
              position={width > 640 ? 'bottom-center' : 'bottom-right'}
            />
            <Component {...pageProps} />
          </>
        ) : (
          <Layout>
            <AdProvider>
              <MainLayout>
                <Toaster
                  position={width > 640 ? 'bottom-center' : 'bottom-right'}
                />
                <Component {...pageProps} />
              </MainLayout>
            </AdProvider>
          </Layout>
        )}
      </ThemeProvider>
    </main>
  );
}

export default MyApp;
