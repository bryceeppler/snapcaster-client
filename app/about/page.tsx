import { Metadata } from 'next';
import PageTitle from '@/components/ui/page-title';

// Client components need to be imported directly
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
    <section className="min-h-screen w-full bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto mb-16 max-w-7xl px-4 py-16 md:px-8">
        <div className="space-y-16">
          <PageTitle
            title="Our Supporters"
            subtitle="We're grateful for the support of these amazing companies."
          />

          {/* Marketplace Preview */}
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <h3 className="text-center text-3xl font-bold">Coming Soon</h3>
              <p>The Snapcaster Marketplace</p>
            </div>
            <div className="relative mx-auto flex max-w-sm items-center justify-center rounded-lg bg-zinc-800/50 p-10">
              <div className="absolute left-3 top-3 text-xs text-white/70">
                Powered By
              </div>
              <img
                src="https://imagedelivery.net/kwpOMlVOHoYYK5BfnMRBqg/ff0cfeac-4e3a-494c-e6fb-4b671b2f3200/public"
                alt="Sort Swift"
                className="w-full"
              />
            </div>
          </div>

          {/* Sponsors Section */}
          <SponsorSection />

          {/* Vendors Section */}
          <VendorsSection />
        </div>
      </div>
    </section>
  );
}
