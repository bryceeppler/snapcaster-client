import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function Component() {
  const [adVisible, setAdVisible] = useState(false);
  return (
    <section className="flex h-screen w-full flex-col items-center space-y-8 px-4 text-center">
      <Link
        data-position-id="top-banner"
        data-ad-type="horizontal-banner"
        data-ad-id="1"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
        href="https://bryceeppler.com/"
      >
        Tier 1 Ad
      </Link>
      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={() => {
            setAdVisible(!adVisible);
          }}
        >
          Toggle Ad
        </Button>
      </div>
      {adVisible && (
        <Link
          data-position-id="left-banner"
          data-ad-type="vertical-banner"
          data-ad-id="2"
          className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
          href="https://github.com"
        >
          Ad No 2
        </Link>
      )}
      <Link
        data-position-id="bottom-banner"
        data-ad-type="horizontal-banner"
        data-ad-id="3"
        href="https://linkedin.com"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
      >
        Ad No 3
      </Link>
    </section>
  );
}
