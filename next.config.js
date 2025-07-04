/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.shopify.com',
        // pathname: '/.*',
        protocol: 'https'
      },
      {
        hostname: 'cdn.snapcaster.ca',
        // pathname: '/.*',
        protocol: 'https'
      },
      {
        hostname: 'imagedelivery.net',
        // pathname: '/.*',
        protocol: 'https'
      }
    ]
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          // prevents man in the middle attacks. This prevents url parameters from being sent in the referer header to other domains and only Snapcasters base url. (Not relvevent to UTM parameters)
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // prevents clicjacking attacks by preventing pages from being embedded in an iframe/frame or object tag
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // prevents MIME type sniffing attacks. Web browsers won't try to guess the mime type of the content and instead use the one specified in the Content-Type header.
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
          // TODO: Add a Content Security Policy header for js, css, images, fonts, api connections, and other resources (This will be alot more involved and will require a lot of testing).
        ]
      }
    ];
  }
};

import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

import { withSentryConfig } from '@sentry/nextjs';

let config = withBundleAnalyzer(nextConfig);

config = withSentryConfig(config, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'eppler-software',
  project: 'javascript-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});

export default config;
