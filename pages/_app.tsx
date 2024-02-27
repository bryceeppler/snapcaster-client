import { useEffect } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { initGA, logPageView } from '../utils/analytics';
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from 'next/router';

import Script from 'next/script';

import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useWindowSize } from 'usehooks-ts';
import { Inter as FontSans } from "next/font/google"
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
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

  const isResetPasswordPage = router.pathname.includes('/reset-password/');

  return (
    <div className="font-sans antialiased">
      <Layout>
        <Toaster 
          position={
            width > 640 ? 'bottom-center' : 'bottom-right'
          }
          toastOptions={
            {
              // style: {
              //   color: '#FFFFFF',
              //   background: '#27272a', // zinc 800
              // },
            }
          }


        />
        <Component {...pageProps} />
      </Layout>
      {!isResetPasswordPage && (
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
      )}
      {/* <script async src="https://fundingchoicesmessages.google.com/i/pub-6026504058618942?ers=1" nonce="W0DFASoiabMy4-_cYoMhEA"></script><script nonce="W0DFASoiabMy4-_cYoMhEA">(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();</script> */}
      <Script id="googlefc" src="https://fundingchoicesmessages.google.com/i/pub-6026504058618942?ers=1" nonce="W0DFASoiabMy4-_cYoMhEA" />
      <Script
        id="googlefc"
        nonce="W0DFASoiabMy4-_cYoMhEA"
      >
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
    </div>
  );
}
