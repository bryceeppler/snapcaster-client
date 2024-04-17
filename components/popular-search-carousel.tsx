import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CarouselItemType } from '@/stores/store';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

const PopularSearchCarousel = () => {
  const carouselItems = [
    {
      name: 'Dockside Extortionist',
      image_url:
        'https://cards.scryfall.io/png/front/9/e/9e2e3efb-75cb-430f-b9f4-cb58f3aeb91b.png?1673147774'
    },
    {
      name: 'Fork',
      image_url:
        'https://cards.scryfall.io/png/front/e/4/e4ff994a-bddd-486d-9a7b-a8959b4cf1dd.png?1562949548'
    }
  ];

  return (
    <div>
      <h2>Popular this week</h2>
      <Carousel className="mx-auto w-full max-w-xs">
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex h-full max-h-[418px] max-w-[300px] items-center justify-center p-1">
                    <img
                      className="mx-auto h-auto max-h-full w-auto max-w-full rounded-lg object-cover"
                      src={item.image_url}
                      alt={item.name}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default PopularSearchCarousel;
