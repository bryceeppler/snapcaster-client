import React from 'react';
import MainLayout from '@/components/MainLayout';
import SubscriptionCards from '@/components/SubscriptionCards';
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
    <MainLayout>
      <div className="container">
        <PageTitle title={title} />
        <div className="outlined-container mx-auto grid max-w-md gap-4 p-8 md:gap-4">
          <p className="text-left">{message}</p>
        </div>
        <div className="p-3" />
        <SubscriptionCards createCheckoutSession={createCheckoutSession} />
      </div>
    </MainLayout>
  );
};

export default SubscriptionRequired;
