import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Analytics } from '@vercel/analytics/react';
import Layout from '@/components/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';
import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
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
  return (
    <div className="bg-black">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyUserContextProvider>
      </SessionContextProvider>
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
