import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UsersByDeviceData, PopularSearchedCard, PopularBuyClicksByTCG } from '@/lib/GA4Client';

import useGlobalStore from '@/stores/globalStore';
import { Integrations } from '@/components/welcome/integrations';
import Testimonials from '@/components/welcome/testimonials';
import { SignupForm } from '@/components/forms/SignupForm';
import { toast } from 'sonner';
import {
  CheckCircle,
  DollarSignIcon,
  GlobeIcon,
  MoveRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SolutionsGrid } from '@/components/welcome/solutions-grid';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import Hero from '@/components/vendors/tier3/hero';
import Tier3Overview from '@/components/vendors/tier3/tier-3-overview';
import Buylists from '@/components/vendors/tier3/buylists';
import Analytics from '@/components/vendors/tier3/analytics';
import OtherFeatures from '@/components/vendors/tier3/other-features';
import Multisearch from '@/components/vendors/tier3/multisearch';
import Visibility from '@/components/vendors/tier3/visibility';
import Pricing from '@/components/vendors/tier3/pricing';
type Props = {};

const Tier3 = (props: Props) => {
  const [popularBuyClicks, setPopularBuyClicks] = useState<PopularBuyClicksByTCG | undefined>(undefined);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [ buyClicksResponse] = await Promise.all([
          fetch('/api/analytics/popular-buy-clicks?limit=10')
        ]);

        if (!buyClicksResponse.ok) throw new Error('Failed to fetch popular buy clicks data');

        const buyClicksData = await buyClicksResponse.json();

        setPopularBuyClicks(buyClicksData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <>
      <div className="invisible h-2 w-full bg-primary sm:visible"></div>
      <div className="relative min-h-screen lg:overflow-hidden">
        <Hero />
        <Tier3Overview />
        <Analytics 
          variant="dark" 
          popularBuyClicks={popularBuyClicks}
        />
        <Visibility />
        <Buylists variant="dark" />
        <Multisearch />
        <OtherFeatures variant="dark" />
        <Pricing variant="light" />
        <footer className="bg-primary text-white py-16 border-t border-white/10">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Snapcaster</h3>
                <p className="text-sm text-white/70">
                  Canada's fastest growing TCG price comparison platform, helping vendors reach more customers and grow their business.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#analytics" className="text-sm text-white/70 hover:text-white transition-colors">Analytics</a></li>
                  <li><a href="#brand-visibility" className="text-sm text-white/70 hover:text-white transition-colors">Brand Visibility</a></li>
                  <li><a href="#other-features" className="text-sm text-white/70 hover:text-white transition-colors">Other Features</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-white/70">Email: info@snapcaster.gg</li>
                </ul>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Ready to Get Started?</h3>
                <p className="text-sm text-white/70">
                  Join Canada's fastest growing TCG marketplace platform.
                </p>
                <Button className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90">
                  Sign Up Now
                </Button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/60">
              <p>© {new Date().getFullYear()} Snapcaster. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Tier3;
