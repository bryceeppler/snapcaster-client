'use client';

import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWindowSize } from 'usehooks-ts';

// Ad Context
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

// Safely handle subscription checks
const AdProvider: React.FC<AdProviderProps> = ({ children }) => {
  const [showAds, setShowAds] = useState(true);

  // Move this into an effect to prevent initialization issues
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

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a QueryClient instance that persists across renders
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

  const { width = 0 } = useWindowSize();

  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AdProvider>
          <Toaster position={width > 640 ? 'bottom-center' : 'bottom-right'} />
          {children}
        </AdProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
