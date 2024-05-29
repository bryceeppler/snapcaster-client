import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Component() {
  const [adVisible, setAdVisible] = useState(false);
  return (
    <section className="flex h-screen w-full flex-col items-center space-y-8 px-4 text-center">
      <div
        data-position-id="1"
        data-ad-type="banner"
        data-ad-id="top-banner"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
      >
        Tier 1 Ad
      </div>
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
        <div
          data-position-id="2"
          data-ad-type="vertical-banner"
          data-ad-id="left-banner"
          className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
        >
          Ad No 2
        </div>
      )}
      <div
        data-position-id="3"
        data-ad-type="horizontal-banner"
        data-ad-id="bottom-banner"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
      >
        Ad No 3
      </div>
    </section>
  );
}
