'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { coreService } from '@/services/coreService';

function MerchantOnboarding() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(
    null
  );
  return (
    <div>
      <h1>Merchant Onboarding</h1>
      <div>
        {!connectedAccountId && (
          <p>Snapcaster is a platform for buying and selling trading cards.</p>
        )}
        {connectedAccountId && (
          <h2>Add information to start accepting money</h2>
        )}
        {connectedAccountId && (
          <p>
            Snapcaster partners with Stripe to help you receive payments and
            keep your personal bank and details secure.
          </p>
        )}
        {!accountCreatePending && !connectedAccountId && (
          <Button
            onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
              const account = await coreService.createStripeAccount();

              if (account) {
                setConnectedAccountId(account);
              }

              if (error) {
                setError(true);
              }
              setAccountCreatePending(false);
            }}
          >
            Create an account!
          </Button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <Button
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              await coreService.createStripeAccountLink(connectedAccountId);
            }}
          >
            Add information
          </Button>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId ||
          accountCreatePending ||
          accountLinkCreatePending) && (
          <div className="dev-callout">
            {connectedAccountId && (
              <p>
                Your connected account ID is:{' '}
                <code className="bold">{connectedAccountId}</code>
              </p>
            )}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default MerchantOnboarding;
