import { useState } from 'react';
import SingleCatalogRow from '@/components/single-search/single-list-item';
import { SingleSearchResult } from '@/stores/store';
import HorizontalBannerAd from '@/components/horizontal-ad';

type CatalogRowProps = {
  cardData: SingleSearchResult;
  promoted?: boolean;
  tcg: string;
};

export default function Component() {
  const [adVisible, setAdVisible] = useState(false);

  const cardData = {
    name: 'test',
    price: 10,
    condition: 'NM',
    foil: false,
    link: 'https://www.testwebsite.com/dockside-extortionist-360-borderless-double-masters-2022/',
    website: 'testwebsite'
  } as SingleSearchResult;

  console.log(cardData);

  return (
    <section className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center space-y-8 text-center">
      <p>This is for testing analytics on prod</p>
      <h1 className="text-3xl font-bold">Ad Tester</h1>

      <HorizontalBannerAd
        positionId="top-banner"
        adType="horizontal-banner"
        adId="1"
        href="https://bryceeppler.com/"
      >
        Tier 1 Ad
      </HorizontalBannerAd>

      <HorizontalBannerAd
        positionId="bottom-banner"
        adType="horizontal-banner"
        adId="3"
        href="https://linkedin.com"
      >
        Tier 2 Ad
      </HorizontalBannerAd>

      {/* Buy button tester */}
      <h1 className="text-3xl font-bold">Buy Button Tester</h1>
      <SingleCatalogRow cardData={cardData} tcg="mtg" />
    </section>
  );
}
