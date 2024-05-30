import { useEffect } from 'react';
import React from 'react';
import { AppContext, AppProps } from 'next/app';
import Layout from '@/components/ui/root-layout';
import { initGA, logPageView } from '../utils/analytics';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import App from 'next/app';
import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';
import { Inter } from 'next/font/google';
import useGlobalStore from '@/stores/globalStore';
import { AdsResponse } from '@/types/ads';

const inter = Inter({ subsets: ['latin'] });

interface MyAppProps extends AppProps {
  ads: AdsResponse;
}

function MyApp({ Component, pageProps, ads }: MyAppProps) {
  const { width = 0, height = 0 } = useWindowSize();
  const setAds = useGlobalStore((state) => state.setAds);

  useEffect(() => {
    setAds(ads);
  }, [ads, setAds]);

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

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  // Fetch ads data
  let ads: AdsResponse = { position: {} };
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ads`);
    ads = await res.json();
  } catch (error) {
    console.error('Error fetching ads:', error);
  }

  return { ...appProps, ads };
};

export default MyApp;
