import { useEffect } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { initGA, logPageView } from '../utils/analytics';
import toast, { Toaster } from 'react-hot-toast';

import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';

export default function MyApp({ Component, pageProps }: AppProps) {
  const {width = 0, height = 0} = useWindowSize();
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);
  useEffect(() => {
    var ads = document.getElementsByClassName('adsbygoogle').length;
    for (var i = 0; i < ads - 1; i++) {
      try {
        let adsbygoogle: any;
        (adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {}
    }
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
    <div className="">
      <Layout>
        <Toaster 
          position={
            width > 640 ? 'bottom-center' : 'bottom-right'
          }
          toastOptions={
            {
              style: {
                color: '#FFFFFF',
                background: '#27272a', // zinc 800
              },
            }
          }


        />
        <Component {...pageProps} />
      </Layout>
      <Script
        id="Absence-banner"
        async
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Script failed to load', e);
        }}
        src={`${process.env.NEXT_PUBLIC_ADSENSE}`}
        crossOrigin="anonymous"
      />
    </div>
  );
}
