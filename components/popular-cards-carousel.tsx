import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

type Props = {};
export default function PopularCardsCarousel({}: Props) {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 10000,
      stopOnInteraction: true
    }) as any
  );

  return (
    <div className="relative mx-auto w-full ">
      <h1 className="mx-7 text-left text-2xl font-semibold md:mx-9 ">
        Featured Magic The Gathering
      </h1>
      <Carousel
        plugins={[autoplayPlugin.current]}
        opts={{
          align: 'start',
          loop: true
        }}
        className="mt-2 flex w-full"
      >
        <div className="mr-1  hover:bg-accent">
          <CarouselPrevious className="relative top-[0%] mr-0 h-full w-full -translate-y-0 rounded-none border-none px-1 text-sm font-medium  hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none sm:px-2 " />
        </div>

        <CarouselContent className="-ml-1">
          {Array.from({ length: 20 }).map((_, index) => (
            <CarouselItem
              key={index}
              className=" basis-[50%] rounded-lg pl-1   sm:basis-[50%] md:basis-[25%]"
            >
              <div className="bg-popover p-[0.12rem]">
                <Card className="border-none">
                  <CardContent className="flex aspect-card w-full items-center justify-center ">
                    <span className="text-2xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="ml-1  hover:bg-accent">
          <CarouselNext className="text-md relative top-[0%] ml-0 h-full w-full -translate-y-0 rounded-none border-none px-1 font-medium hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none sm:px-2" />
        </div>
      </Carousel>
    </div>
  );
}
