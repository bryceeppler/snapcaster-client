import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { PopularBuyClicksByTCG } from '@/lib/GA4Client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tier3SignupForm } from '@/components/forms/Tier3SignupForm';
import { toast } from 'sonner';
import Hero from '@/components/vendors/tier3/hero';
import Tier3Overview from '@/components/vendors/tier3/tier-3-overview';
import Buylists from '@/components/vendors/tier3/buylists';
import Analytics from '@/components/vendors/tier3/analytics';
import OtherFeatures from '@/components/vendors/tier3/other-features';
import Multisearch from '@/components/vendors/tier3/multisearch';
import Visibility from '@/components/vendors/tier3/visibility';
import Pricing from '@/components/vendors/tier3/pricing';

const Tier3 = () => {
  const [popularBuyClicks, setPopularBuyClicks] = useState<
    PopularBuyClicksByTCG | undefined
  >(undefined);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>(
    'quarterly'
  );

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [buyClicksResponse] = await Promise.all([
          fetch('/api/analytics/popular-buy-clicks?limit=10')
        ]);

        if (!buyClicksResponse.ok)
          throw new Error('Failed to fetch popular buy clicks data');

        const buyClicksData = await buyClicksResponse.json();

        setPopularBuyClicks(buyClicksData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  const openSignupDialog = (plan: 'monthly' | 'quarterly' = 'quarterly') => {
    setSelectedPlan(plan);
    setIsSignupOpen(true);
  };

  const handleSignupSuccess = () => {
    setIsSignupOpen(false);
    setIsConfirmationOpen(true);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('info@snapcaster.gg');
    toast.success('Email copied to clipboard!');
  };

  return (
    <>
      <div className="relative min-h-screen lg:overflow-hidden">
        <Hero onSignup={() => openSignupDialog('quarterly')} />
        <Tier3Overview onSignup={() => openSignupDialog('quarterly')} />
        <Buylists
          variant="dark"
          onSignup={() => openSignupDialog('quarterly')}
        />
        <Multisearch />

        <Analytics
          variant="dark"
          popularBuyClicks={popularBuyClicks}
          onSignup={() => openSignupDialog('quarterly')}
        />
        <Visibility />
        <OtherFeatures variant="dark" />
        <Pricing variant="light" onSignup={openSignupDialog} />
        <footer className="border-t border-white/10 bg-primary py-16 text-white">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Snapcaster</h3>
                <p className="text-sm text-white/70">
                  Canada's largest TCG price comparison platform, helping
                  vendors reach more customers and grow their business.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#analytics"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a
                      href="#brand-visibility"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      Brand Visibility
                    </a>
                  </li>
                  <li>
                    <a
                      href="#other-features"
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      Other Features
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-white/70">
                    Email: info@snapcaster.gg
                  </li>
                </ul>
              </div>

              {/* Call to Action */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Ready to Get Started?</h3>
                <p className="text-sm text-white/70">
                  Join Canada's largest TCG marketplace platform.
                </p>
                <Button
                  className="gap-3 bg-[#f8c14a] text-white hover:bg-[#f8c14a]/90"
                  onClick={() => openSignupDialog('quarterly')}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-white/60">
              <p>
                © {new Date().getFullYear()} Snapcaster. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Signup Dialog */}
        <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply for Tier 3 Access</DialogTitle>
              <DialogDescription>
                Join Canada's largest TCG marketplace platform and start growing
                your business today.
              </DialogDescription>
            </DialogHeader>
            <Tier3SignupForm
              onSuccess={handleSignupSuccess}
              initialPlan={selectedPlan}
            />
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Application Received! 🎉</DialogTitle>
              <DialogDescription className="space-y-4 pt-4">
                <p>
                  Thank you for applying to become a Tier 3 partner! We're
                  excited to have you join our growing community of successful
                  TCG vendors.
                </p>
                <p>
                  Our team will review your application and get back to you
                  within 1-2 business days with a contract. In the meantime,
                  feel free to email us at{' '}
                  <button
                    onClick={copyEmailToClipboard}
                    className="cursor-pointer text-blue-500 underline transition-colors hover:text-blue-600"
                  >
                    info@snapcaster.gg
                  </button>{' '}
                  if you have any questions.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsConfirmationOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Tier3;
