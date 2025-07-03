import AboutUs from '@/components/about/about-us';
import ComingSoon from '@/components/about/coming-soon';
import SponsorSection from '@/components/about/sponsor-section';
import VendorsSection from '@/components/about/vendors-section';
import type { Metadata } from 'next';

export default function AboutPage() {
  return (
    <>
      <h1 className="sr-only">About Snapcaster</h1>

      <main className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl space-y-24">
          <ComingSoon />
          <AboutUs />
          <SponsorSection />
          <VendorsSection />
        </div>
      </main>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Snapcaster | About',
  description:
    'Snapcaster helps you search and compare trading card prices across 80+ Canadian stores for singles, sealed, and more.',
  openGraph: {
    title: 'Snapcaster | About',
    description:
      'Snapcaster helps you search and compare trading card prices across 80+ Canadian stores for singles, sealed, and more.',
    url: 'https://snapcaster.ca/about',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true
  },
  authors: [{ name: 'Snapcaster' }],
  alternates: {
    canonical: 'https://snapcaster.ca/about'
  }
};
