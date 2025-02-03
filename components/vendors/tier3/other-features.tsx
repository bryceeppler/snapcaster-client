import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionTitle from './section-title';
import { LucideIcon, MessageCircle, Mail, Ticket } from 'lucide-react';

const OtherFeatures = ({ variant }: { variant: 'dark' | 'light' }) => {
  const features = [
    {
      title: 'Discord',
      description:
        'Gain access to special Discord announcement channels. We can connect to your Discord server to forward your announcements to our Discord community. You also receive a special roles in our sever marking you as a Snapcaster Partnered vendor.',
      icon: MessageCircle
    },
    {
      title: 'Newsletter',
      description:
        'We have a monthly email newsletter with over 1100 subscribers. We would be happy to feature any events, promotions, sales or other news you have to our newsletter.',
      icon: Mail
    },
    {
      title: 'Pro Discounts',
      description:
        "Receive up to 30 free Snapcaster Pro discount codes to give to your customers however you want. Whether it's a throwin for a giveaway, or part of a prize at a local event. We can provide you with up to 30 free Snapcaster Pro discount codes to give to your customers each month.",
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
          subtitle="OTHER FEATURES"
          title="Other Features"
          paragraph="We offer a variety of features to help you grow your business. Here are some of the features we offer."
          variant={variant}
        />
        <div className="grid md:grid-cols-3 gap-4 mt-16">
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
