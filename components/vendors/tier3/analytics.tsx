import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import {
  Users,
  MapPin,
  MousePointerClick,
  TrendingUp,
  LayoutGrid,
  Trophy,
  LucideIcon,
  ArrowRight
} from 'lucide-react';
import { UsersByDeviceData, PopularBuyClicksByTCG } from '@/lib/GA4Client';
import { PopularBuyClicks } from './popular-searches';
import { Button } from '@/components/ui/button';

interface AnalyticsProps {
  variant: 'light' | 'dark';
  deviceData?: UsersByDeviceData;
  popularBuyClicks?: PopularBuyClicksByTCG;
}

const Analytics = ({ variant, popularBuyClicks }: AnalyticsProps) => {
  const features = [
    {
      title: 'Active Users',
      description:
        'Track active users live and spot trends to make data-driven inventory decisions that boost your bottom line.',
      icon: Users
    },
    {
      title: 'Regional Opportunities',
      description:
        'Uncover untapped markets and optimize shipping costs with regional customer data.',
      icon: MapPin
    },
    {
      title: 'Direct Sales Attribution',
      description:
        'See how much traffic is coming from Snapcaster and how much revenue is being generated, right in your Shopify analytics.',
      icon: MousePointerClick
    },
    {
      title: 'Market Demand Forecasting',
      description:
        'Stay ahead of the market with real-time insights into which cards are trending, before your competition catches on.',
      icon: TrendingUp
    },
    {
      title: 'Multi-TCG Market Intelligence',
      description:
        'Capitalize on emerging TCG opportunities and be first-to-market with in-demand products across all card games.',
      icon: LayoutGrid
    },
    {
      title: 'Competitive Edge Insights',
      description:
        'Benchmark against 91+ Canadian vendors and identify precise opportunities to outperform the market.',
      icon: Trophy
    }
  ];

  return (
    <section
      className={`bg-primary py-20  ${
        variant === 'dark' ? 'text-white' : 'text-primary'
      }`}
      id="analytics"
    >
      <div className="container">
        <SectionTitle
          subtitle="ANALYTICS DASHBOARD"
          title="Transform Your Card Business with Canadian Market Analytics"
          paragraph="Get access to our powerful analytics suite for the Canadian TCG market. Backed by real data and actionable insights you can't find anywhere else."
          variant={variant}
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature) => (
            <Feature
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

        {popularBuyClicks && (
          <div className="relative mt-20">
            <div className="mb-12 text-center">
              <div className="flex flex-row gap-3 justify-center items-center mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <h3 className="text-2xl font-bold">Live Analytics Demo</h3>

              </div>
              <p className="mx-auto max-w-2xl text-white/70">
                Experience real-time insights into customer behavior. This live
                demo shows actual buy-click data from the Snapcaster platform,
                helping vendors identify trending cards and market
                opportunities.
              </p>
            </div>

            <div className="relative mx-auto">
              {/* Content container */}
              <div className="relative mx-auto max-w-lg shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-0">
                {/* Browser-like header */}
                <div className=" flex items-center space-x-2 rounded-t-lg bg-zinc-700 p-3 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 text-center text-sm text-white/70">
                    dashboard.snapcaster.ca
                  </div>
                </div>

                {/* Table container */}
                <div className=" overflow-hidden rounded-b-lg border border-t-0 border-white/10 bg-white p-2">
                  <PopularBuyClicks
                    searchData={popularBuyClicks}
                    variant={variant}
                  />
                </div>
              </div>

              {/* Button */}
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="bg-[#f8c14a] text-white gap-3 hover:bg-[#f8c14a]/90"
                >
                  Sign Up to View the Dashboard{' '}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Feature = ({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) => {
  return (
    <Card className="flex flex-col items-center justify-center bg-popover/20 text-white">
      <CardHeader>
        <Icon className="mx-auto mb-3 h-8 w-8" />
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Analytics;
