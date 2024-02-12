import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Analytics } from '@vercel/analytics/react';
import Layout from '@/components/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';
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
        <MyUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyUserContextProvider>
      <Analytics />
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
