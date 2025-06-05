'use client';

import { useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

import { coreService } from '@/services/coreService';

export default function Refresh() {
  const searchParams = useSearchParams();
  const connectedAccountId = searchParams?.get('connected_account_id');
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (connectedAccountId) {
      setAccountLinkCreatePending(true);
      coreService.createStripeAccountLink(connectedAccountId).then(() => {
        setAccountLinkCreatePending(false);

        window.location.href =
          '/account/marketplace/merchant/onboarding/return';
      });
    }
  }, [connectedAccountId]);

  return (
    <div className="container">
      <div className="banner">
        <h2>Snapcaster</h2>
      </div>
      <div className="content">
        <h2>Add information to start accepting money</h2>
        <p>Snapcaster is a platform for buying and selling trading cards.</p>
        {error && <p className="error">Something went wrong!</p>}
      </div>
      <div className="dev-callout">
        {connectedAccountId && (
          <p>
            Your connected account ID is:{' '}
            <code className="bold">{connectedAccountId}</code>
          </p>
        )}
        {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
      </div>
    </div>
  );
}
