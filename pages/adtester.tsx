import { useState } from 'react';
import SingleCatalogRow from '@/components/single-search/single-list-item';
import { SingleSearchResult } from '@/stores/store';
import BannerAd from '@/components/ad';
import { useEffect } from 'react';

type CatalogRowProps = {
  cardData: SingleSearchResult;
  promoted?: boolean;
  tcg: string;
};
const ads = [
  {
    positionId: 'top-banner',
    adType: 'horizontal-banner',
    adId: '1',
    href: 'https://obsidiangames.ca/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png'
    }
  },
  {
    positionId: 'left-banner',
    adType: 'vertical-banner',
    adId: '2',
    href: 'https://company2.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_382x160.png'
    }
  }
];
export default function Component() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const cardData = {
    name: 'test',
    price: 10,
    condition: 'NM',
    foil: false,
    link: 'https://www.testwebsite.com/dockside-extortionist-360-borderless-double-masters-2022/',
    website: 'testwebsite'
  } as SingleSearchResult;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000); // Rotate every 10 seconds
  }, []);

  return (
    <section className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center space-y-8 text-center">
      <p>This is for testing analytics on prod</p>
      <h1 className="text-3xl font-bold">Ad Tester</h1>

      <BannerAd
        positionId="top-banner"
        adType="horizontal-banner"
        adId={ads[currentAdIndex].adId}
        href={ads[currentAdIndex].href}
      >
        <img
          className="hidden h-fit w-full md:flex"
          src={ads[currentAdIndex].images.desktop}
          alt="ad"
        />
        <img
          className="flex h-full w-full object-cover md:hidden"
          src={ads[currentAdIndex].images.mobile}
          alt="ad"
        />
      </BannerAd>

      {/* Buy button tester */}
      <h1 className="text-3xl font-bold">Buy Button Tester</h1>
      <SingleCatalogRow cardData={cardData} tcg="mtg" />
    </section>
  );
}
