import Link from 'next/link';

import { Button } from '@/components/ui/button';

function MarketplacePage() {
  const hasOnboarded = false;
  const isMerchant = true;

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4 rounded-md border border-border bg-card p-4">
        <h2>Merchant</h2>
        <Link href="/account/marketplace/merchant/onboarding/start">
          <Button>
            <span>Merchant Onboarding</span>
          </Button>
        </Link>
      </div>
      <div className="space-y-4 rounded-md border border-border bg-card p-4">
        <h2>Buyer</h2>
        <Link href="/account/marketplace/buyer/onboarding">
          <Button>
            <span>Buyer Onboarding</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default MarketplacePage;
