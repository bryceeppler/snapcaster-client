import React from 'react';
import useGlobalStore from '@/stores/globalStore';
import BannerAd from './ad';
import VerticalBannerAd from './vertical-ad';
import AdCarousel from './ad-carousel';
type Props = {};

const ads = [
  {
    positionId: 'top-banner',
    adType: 'horizontal-banner',
    adId: '1',
    url: 'https://obsidiangames.ca/',
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
    url: 'https://company2.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_382x160.png'
    }
  },
  {
    positionId: 'side-banner',
    adType: 'vertical-banner',
    adId: '3',
    url: 'https://example.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_mtg_vertical_lg.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/ad_placeholder_vertical.png'
    }
  }
];

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  const { adsEnabled, ads: adsNew } = useGlobalStore();
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);
  console.log(adsNew);
  return (
    <main className="container w-full max-w-5xl flex-1 flex-col items-center justify-center px-2 py-8">
      {adsEnabled && (
        <>
          {/* top banner : position 1 */}
          <BannerAd
            positionId="top-banner"
            adType="horizontal-banner"
            adId={ads[currentAdIndex].adId}
            url={ads[currentAdIndex].url}
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
          {/* left ad : position 2 */}
          <VerticalBannerAd
            positionId="left-banner"
            adType="vertical-banner"
            side="left"
            adId="2"
            url={`https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_vertical_pokemon.png`}
          >
            <img
              src={`https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_mtg_vertical.png`}
              alt="ad"
              className="h-full"
            />
          </VerticalBannerAd>
          {/* right ad : position 3 */}
          <AdCarousel />
        </>
      )}
      <div className="mt-8">{children}</div>
    </main>
  );
}
