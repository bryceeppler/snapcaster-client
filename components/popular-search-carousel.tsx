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

type Props = {};

const PopularSearchCarousel = () => {
  const carouselItems = [
    {
      name: 'Dockside Extortionist',
      image_url:
        'https://cdn.snapcaster.ca/processed_images/5531ecea-5578-56f0-b3f7-583b8049be8e_58f41638-1a08-405e-8103-52edbb46d97c.jpg%3Fv%3D1699824213'
    },
    {
      name: 'Fork',
      image_url:
        'https://cards.scryfall.io/png/front/e/4/e4ff994a-bddd-486d-9a7b-a8959b4cf1dd.png?1562949548'
    },
    {
      name: 'Dockside Extortionist',
      image_url:
        'https://cards.scryfall.io/png/front/9/e/9e2e3efb-75cb-430f-b9f4-cb58f3aeb91b.png?1673147774'
    },
    {
      name: 'Fork',
      image_url:
        'https://cards.scryfall.io/png/front/e/4/e4ff994a-bddd-486d-9a7b-a8959b4cf1dd.png?1562949548'
    },
    {
      name: 'Dockside Extortionist',
      image_url:
        'https://cards.scryfall.io/png/front/9/e/9e2e3efb-75cb-430f-b9f4-cb58f3aeb91b.png?1673147774'
    },
    {
      name: 'Fork',
      image_url:
        'https://cards.scryfall.io/png/front/e/4/e4ff994a-bddd-486d-9a7b-a8959b4cf1dd.png?1562949548'
    },
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
    <div className="px-12 py-6">
      <h2 className="text-2xl font-bold">Trending Now</h2>
      <div className="p-4"></div>
      <Carousel className="mx-auto">
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-0 sm:p-6">
                    <img
                      className="mx-auto h-auto max-h-[300px] w-auto max-w-full rounded-lg object-cover"
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
