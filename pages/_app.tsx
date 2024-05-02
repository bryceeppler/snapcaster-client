import { useEffect, useLayoutEffect } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { initGA, logPageView } from '../utils/analytics';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';
import { Inter } from 'next/font/google';
import { advancedUseStore } from '@/stores/advancedStore';
import { useStore } from '@/stores/store';
const inter = Inter({ subsets: ['latin'] });

export default function MyApp({ Component, pageProps }: AppProps) {
  // const { initSetInformation } = advancedUseStore();
  const { initWebsiteInformation, initSetInformation } = useStore();

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
  useEffect(() => {
    initSetInformation();
    initWebsiteInformation();
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

      <Script
        id="googlefc"
        src="https://fundingchoicesmessages.google.com/i/pub-6026504058618942?ers=1"
        nonce="W0DFASoiabMy4-_cYoMhEA"
      />
      <Script id="googlefc" nonce="W0DFASoiabMy4-_cYoMhEA">
        {`
          (function() {
            function signalGooglefcPresent() {
              if (!window.frames['googlefcPresent']) {
                if (document.body) {
                  const iframe = document.createElement('iframe');
                  iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                  iframe.style.display = 'none';
                  iframe.name = 'googlefcPresent';
                  document.body.appendChild(iframe);
                } else {
                  setTimeout(signalGooglefcPresent, 0);
                }
              }
            }
            signalGooglefcPresent();
          })();
        `}
      </Script>
    </main>
  );
}
