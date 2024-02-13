import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { initGA, logPageView } from '../utils/analytics';

import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);
  useEffect(() => {
    var ads = document.getElementsByClassName("adsbygoogle").length;
    console.log(ads)
    for (var i = 0; i < ads -1; i++) {
      try {
        let adsbygoogle: any;
        (adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) { }
    }
}, []);
useEffect(() => {
  if (process.env.NODE_ENV === 'production') {
    initGA();
    logPageView();
  }
  else {
    initGA();
  }
}, []);
  return (
    <div className="">
          <Layout>
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
