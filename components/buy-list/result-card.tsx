import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import useBuyListStore from '@/stores/buyListStore';
import { useStore } from '@/stores/store';

type Props = { cardData: any };
export default function ResultCard({ cardData }: Props) {
  const [selectedCondition, setSelectedCondition] = useState('nm');
  const [selectedStore, setSelectedStore] = useState('');
  const [cashPrice, setCashPrice] = useState(0);
  const [creditPrice, setCreditPrice] = useState(0);
  const { addToCart } = useBuyListStore();
  const { getWebsiteNameByCode, websites } = useStore();

  useEffect(() => {
    setSelectedStore(Object.keys(cardData.nm)[0]);

    if (Object.keys(cardData[selectedCondition]).length === 0) {
      setCashPrice(0);
      setCreditPrice(0);
      setSelectedStore('N/A');
    } else {
      Object.entries(cardData[selectedCondition]).forEach(
        ([storeName, prices]: any) => {
          const { cashPrice, creditPrice } = prices;
          if (selectedStore === storeName) {
            setCashPrice(cashPrice);
            setCreditPrice(creditPrice);
          }
        }
      );
    }
  }, [selectedCondition]);

  useEffect(() => {
    Object.entries(cardData[selectedCondition]).forEach(
      ([storeName, prices]: any) => {
        const { cashPrice, creditPrice } = prices;
        if (selectedStore === storeName) {
          setCashPrice(cashPrice);
          setCreditPrice(creditPrice);
        }
      }
    );
  }, [selectedStore]);
  return (
    <>
      <Card className="block bg-popover md:hidden">
        <div className="border-border-colour grid grid-cols-12 rounded-md  p-4">
          <div className="col-span-3">
            <div className="relative mx-auto max-w-[150px]  md:max-w-[250px]">
              <CardImage imageUrl={cardData.image} alt="test image" />
            </div>
          </div>
          <div className="col-span-9 flex flex-col pl-4">
            <div>
              <CardTitle className="text-sm font-semibold">
                {cardData.name}
              </CardTitle>
              <CardDescription className="text-xs font-semibold capitalize">
                {cardData.set}
              </CardDescription>
            </div>
            <div className="mt-auto">
              <div className="flex flex-row gap-2 text-sm font-semibold text-muted-foreground">
                <p>{cardData.foil}</p>
              </div>
              <div className="flex text-sm">
                <div className="w-1/2 text-center">
                  <p className="font-medium text-muted-foreground ">Cash</p>
                  <p className="font-semibold">${cashPrice}</p>
                </div>
                <div className="w-1/2 text-center">
                  <p className="font-medium text-muted-foreground">Credit</p>
                  <p className="font-semibold">${creditPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex font-bold">
          <Select
            value={selectedCondition}
            onValueChange={(value) => {
              setSelectedCondition(value);
            }}
          >
            <SelectTrigger className=" border-border-colour  mr-2 w-1/2 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Near Mint" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Condition</SelectLabel>
                <SelectItem value="nm">Near Mint</SelectItem>
                <SelectItem value="lp">Lightly Played</SelectItem>
                <SelectItem value="mp">Moderetly Played</SelectItem>
                <SelectItem value="hp">Heavily Played</SelectItem>
                <SelectItem value="dmg">Damaged</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className="w-1/2 font-bold"
            onClick={() => {
              const tempCardData = {
                name: cardData.name,
                set: cardData.set,
                foil: cardData.foil,
                cashPrice: cashPrice,
                creditPrice: creditPrice,
                condition: selectedCondition
              };

              selectedStore !== 'N/A'
                ? (toast(`${cardData.name} Added to Cart`, {
                    description: `${cardData.set}`
                  }),
                  addToCart(selectedStore, tempCardData))
                : toast(`Error Adding ${cardData.name} to Cart`, {
                    description: `Item is not Elibible for Purchase`
                  });
            }}
          >
            Add To Cart
          </Button>
        </div>
        <div className="mt-2 font-bold">
          <Select
            onValueChange={(value) => {
              setSelectedStore(value);
            }}
          >
            <SelectTrigger className="   border-border-colour  w-full focus:ring-0 focus:ring-offset-0">
              {/* <SelectValue placeholder="obsidian" /> */}
              <div className="flex">
                {websites &&
                  websites.map(
                    (website, index) =>
                      selectedStore === website.slug &&
                      website.image_source && (
                        <img
                          src={website.image_source}
                          alt="Website"
                          className="h-4 w-4"
                          key={index}
                        />
                      )
                  )}
                &nbsp;{getWebsiteNameByCode(selectedStore)}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(cardData[selectedCondition]).map(
                  ([storeName, { cashPrice, creditPrice }]: any) => (
                    <SelectItem
                      key={storeName}
                      value={storeName}
                      className="w-full"
                    >
                      <div className="flex items-center">
                        <div className="flex w-3/5 items-center">
                          {websites &&
                            websites.map(
                              (website, index) =>
                                storeName === website.slug &&
                                website.image_source && (
                                  <img
                                    src={website.image_source}
                                    alt="Website"
                                    className="h-4 w-4"
                                    key={index}
                                  />
                                )
                            )}
                          &nbsp;
                          {getWebsiteNameByCode(storeName)}
                        </div>
                        <div className="w-2/5">
                          <div className="ml-auto flex w-min">
                            <p className="w-min">Cash:</p>
                            <p className="w-min">${cashPrice}</p>
                          </div>
                          <div className="ml-auto flex w-min">
                            <p className="w-min">Credit:</p>
                            <p className="w-min">${creditPrice}</p>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="hidden md:block">
        <div className="border-border-colour grid grid-cols-12 rounded-md bg-popover p-4">
          <div className="col-span-3">
            <div className="relative mx-auto max-w-[150px]  md:max-w-[250px]">
              <CardImage imageUrl={cardData.image} alt="test image" />
            </div>
          </div>
          <div className="col-span-9 flex flex-col pl-4">
            <div>
              <CardTitle className="text-md font-semibold">
                {cardData.name}
              </CardTitle>
              <CardDescription className="text-sm font-semibold capitalize">
                {cardData.set}
              </CardDescription>
            </div>
            <div className="mt-auto">
              <div className="flex flex-row gap-2 text-sm font-semibold text-muted-foreground">
                <p>{cardData.foil} </p>
              </div>
              <div className="flex text-sm">
                <div className="w-1/2 text-center">
                  <p className="font-medium text-muted-foreground ">Cash</p>
                  <p className="font-semibold">${cashPrice}</p>
                </div>
                <div className="w-1/2 text-center">
                  <p className="font-medium text-muted-foreground">Credit</p>
                  <p className="font-semibold">${creditPrice}</p>
                </div>
              </div>
              <div className="mt-2 flex font-bold">
                <Select
                  value={selectedCondition}
                  onValueChange={(value) => {
                    setSelectedCondition(value);
                  }}
                >
                  <SelectTrigger className=" border-border-colour  mr-2 w-1/2 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Near Mint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Condition</SelectLabel>
                      <SelectItem value="nm">Near Mint</SelectItem>
                      <SelectItem value="lp">Lightly Played</SelectItem>
                      <SelectItem value="mp">Moderetly Played</SelectItem>
                      <SelectItem value="hp">Heavily Played</SelectItem>
                      <SelectItem value="dmg">Damaged</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button
                  className="w-1/2 font-bold"
                  onClick={() => {
                    const tempCardData = {
                      name: cardData.name,
                      set: cardData.set,
                      foil: cardData.foil,
                      cashPrice: cashPrice,
                      creditPrice: creditPrice,
                      condition: selectedCondition
                    };

                    selectedStore !== 'N/A'
                      ? (toast(`${cardData.name} Added to Cart`, {
                          description: `${cardData.set}`
                        }),
                        addToCart(selectedStore, tempCardData))
                      : toast(`Error Adding ${cardData.name} to Cart`, {
                          description: `Item is not Elibible for Purchase`
                        });
                  }}
                >
                  Add To Cart
                </Button>
              </div>
              <div className="mt-2 font-bold">
                <Select
                  onValueChange={(value) => {
                    setSelectedStore(value);
                  }}
                >
                  <SelectTrigger className="   border-border-colour  w-full focus:ring-0 focus:ring-offset-0">
                    {/* <SelectValue placeholder="obsidian" /> */}
                    <div className="flex items-center">
                      {websites &&
                        websites.map(
                          (website, index) =>
                            selectedStore === website.slug &&
                            website.image_source && (
                              <img
                                src={website.image_source}
                                alt="Website"
                                className="h-4 w-4"
                                key={index}
                              />
                            )
                        )}
                      &nbsp;{getWebsiteNameByCode(selectedStore)}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Store</SelectLabel>
                      <SelectGroup>
                        {Object.entries(cardData[selectedCondition]).map(
                          ([storeName, { cashPrice, creditPrice }]: any) => (
                            <SelectItem
                              key={storeName}
                              value={storeName}
                              className="w-full"
                            >
                              <div className="flex items-center">
                                <div className="flex w-3/5 items-center">
                                  {websites &&
                                    websites.map(
                                      (website, index) =>
                                        storeName === website.slug &&
                                        website.image_source && (
                                          <img
                                            src={website.image_source}
                                            alt="Website"
                                            className="h-4 w-4"
                                            key={index}
                                          />
                                        )
                                    )}
                                  &nbsp;
                                  {getWebsiteNameByCode(storeName)}
                                </div>
                                <div className="w-2/5">
                                  <div className="ml-auto flex w-min">
                                    <p className="w-min">Cash:</p>
                                    <p className="w-min">${cashPrice}</p>
                                  </div>
                                  <div className="ml-auto flex w-min">
                                    <p className="w-min">Credit:</p>
                                    <p className="w-min">${creditPrice}</p>
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
