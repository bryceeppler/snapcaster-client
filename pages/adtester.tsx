import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { handleAdClick } from '@/utils/analytics';
import SingleCatalogRow from '@/components/single-search/single-list-item';
import { SingleSearchResult } from '@/stores/store';
type CatalogRowProps = {
  cardData: SingleSearchResult;
  promoted?: boolean;
  tcg: string;
};
export default function Component() {
  const [adVisible, setAdVisible] = useState(false);
  return (
    <section className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center space-y-8 text-center">
      <p>This is for testing analytics on prod</p>
      <h1 className="text-3xl font-bold">Ad Tester</h1>
      <Link
        data-position-id="top-banner"
        data-ad-type="horizontal-banner"
        data-ad-id="1"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
        href="https://bryceeppler.com/"
        target="_blank"
        onClick={() =>
          handleAdClick(
            'top-banner',
            'horizontal-banner',
            '1',
            'https://bryceeppler.com/'
          )
        }
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
          target="_blank"
          data-position-id="left-banner"
          data-ad-type="vertical-banner"
          data-ad-id="2"
          className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
          href="https://github.com"
          onClick={() =>
            handleAdClick(
              'left-banner',
              'vertical-banner',
              '2',
              'https://github.com'
            )
          }
        >
          Ad No 2
        </Link>
      )}
      <Link
        data-position-id="bottom-banner"
        data-ad-type="horizontal-banner"
        data-ad-id="3"
        target="_blank"
        href="https://linkedin.com"
        className="ad flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700"
        onClick={() =>
          handleAdClick(
            'bottom-banner',
            'horizontal-banner',
            '3',
            'https://linkedin.com'
          )
        }
      >
        Ad No 3
      </Link>
      {/* Buy button tester */}
      <h1 className="text-3xl font-bold">Buy Button Tester</h1>
      <SingleCatalogRow
        cardData={
          {
            name: 'test',
            price: 10,
            condition: 'NM',
            foil: false,
            link: 'https://example.com',
            website: 'testwebsite'
          } as SingleSearchResult
        }
        tcg="mtg"
      />
    </section>
  );
}
