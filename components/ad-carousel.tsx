import * as React from 'react';
import { handleAdClick } from '@/utils/analytics';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const ads = [
  {
    positionId: 'right-banner',
    adType: 'horizontal-banner',
    adId: '3',
    url: 'https://obsidiangames.ca/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_vertical_pokemon.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/obsidian_1008x160.png'
    }
  },
  {
    positionId: 'right-banner',
    adType: 'vertical-banner',
    adId: '4',
    url: 'https://company2.com/',
    images: {
      desktop:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/ad_placeholder.png',
      mobile:
        'https://s3.ca-central-1.amazonaws.com/cdn.snapcaster.ca/ad_placeholder.png'
    }
  }
];

export default function AdCarousel() {
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);
  const side = 'right' as 'right' | 'left';

  return (
    <Carousel
      data-position-id={ads[currentAdIndex].positionId}
      data-ad-type={ads[currentAdIndex].adType}
      data-ad-id={ads[currentAdIndex].adId}
      className={`ad fixed max-h-[480px] ${
        side === 'left' ? 'left-10' : 'right-10'
      } top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col`}
      onClick={() =>
        handleAdClick(
          ads[currentAdIndex].positionId,
          ads[currentAdIndex].adType,
          ads[currentAdIndex].adId,
          ads[currentAdIndex].url
        )
      }
    >
      <CarouselContent>
        {ads.map((ad, index) => {
          return (
            <CarouselItem key={index}>
              <img src={ads[index].images.desktop} alt="ad" />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="" />
      <CarouselNext className="" />
    </Carousel>
  );
}
