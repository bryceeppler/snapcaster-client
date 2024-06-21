import React from 'react';
import SubscriptionCards from '@/components/subscription-options';
import PageTitle from './ui/page-title';

type Props = {
  title: string;
  message: string;
  createCheckoutSession: () => void;
};

const SubscriptionRequired = ({
  title,
  message,
  createCheckoutSession
}: Props) => {
  return (
    <div className="container">
      <PageTitle title={title} />
      <div className="outlined-container mx-auto grid max-w-md gap-4 p-8 md:gap-4">
        <p className="text-left">{message}</p>
      </div>
      <div className="p-3" />
      <SubscriptionCards createCheckoutSession={createCheckoutSession} />
    </div>
  );
};

export default SubscriptionRequired;
