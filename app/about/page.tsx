import type { Metadata } from 'next';

import AboutUs from '@/components/about/about-us';
import ComingSoon from '@/components/about/coming-soon';
import SponsorSection from '@/components/about/sponsor-section';
import VendorsSection from '@/components/about/vendors-section';

export const metadata: Metadata = {
  title: 'About - Snapcaster',
  description: 'Search Magic the Gathering cards across Canada',
  openGraph: {
    title: 'Snapcaster - Search Magic the Gathering cards across Canada',
    description:
      'Find Magic the Gathering singles and sealed product using Snapcaster. Search your favourite Canadian stores.',
    url: 'https://snapcaster.ca',
    type: 'website'
  }
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl space-y-24">
        <ComingSoon />
        <AboutUs />
        <SponsorSection />
        <VendorsSection />
      </div>
    </main>
  );
}
