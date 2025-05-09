import type { LucideIcon } from 'lucide-react';
import { MessageCircle, Mail, Ticket } from 'lucide-react';

import SectionTitle from './section-title';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OtherFeatures = ({ variant }: { variant: 'dark' | 'light' }) => {
  const features = [
    {
      title: 'Exclusive Discord Partnership',
      description:
        'Tap into our thriving community of active TCG buyers. Get a dedicated announcement channel that reaches collectors directly, plus VIP "Snapcaster Partner" roles and announcement channels that instantly boost your credibility.',
      icon: MessageCircle
    },
    {
      title: 'Featured Newsletter Exposure',
      description:
        'Get your promotions in front of 1100+ highly engaged TCG buyers through our premium newsletter (65% average open rate). Partners who feature their sales see a significant boost in traffic during promotional periods. Premium placement for your biggest announcements, sales, and events.',
      icon: Mail
    },
    {
      title: 'Premium Customer Rewards ($89 Value)',
      description:
        'Transform your customer relationships with 30 FREE Snapcaster Pro discount codes monthly ($2.99 value each). Perfect for driving loyalty, powering giveaways, or rewarding your best customers. Our partners use these to support their local events and social media contests to boost engagement.',
      icon: Ticket
    }
  ];
  return (
    <section
      className={`bg-primary py-20 ${
        variant === 'dark' ? 'text-white' : 'text-primary'
      }`}
      id="other-features"
    >
      {' '}
      <div className="container">
        <SectionTitle
          subtitle="EXCLUSIVE PARTNER BENEFITS"
          title="Accelerate Your Growth"
          paragraph="Join an elite group of TCG vendors who are leveraging our premium tools and community to scale their business. Our partners see an average of 20% increase in referrals within their first 3 months."
          variant={variant}
        />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Feature
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
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
    <Card className="flex flex-col items-center bg-popover/20 text-white">
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

export default OtherFeatures;
