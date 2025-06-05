'use client';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { createStripeAccountLink } from '@/actions/core.actions';
import { Button } from '@/components/ui/button';

type Props = {
  stripeAccountId: string;
};

function SetupStripeButton({ stripeAccountId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await createStripeAccountLink(stripeAccountId);
        setIsLoading(false);
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : 'Add information'}
    </Button>
  );
}

export default SetupStripeButton;
