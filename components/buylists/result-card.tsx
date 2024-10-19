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
import { shallow } from 'zustand/shallow';
import CardImage from '../ui/card-image';
import { Button } from '../ui/button';
import useBuyListStore from '@/stores/buyListStore';
import useGlobalStore from '@/stores/globalStore';
import React, { memo, useState, useEffect } from 'react';

type Props = { cardData: any };

const ResultCard = memo(function ResultCard({ cardData }: Props) {
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectableConditions, setSelectableConditions] = useState<string[]>(
    []
  );
  const [selectedStore, setSelectedStore] = useState('');
  const [cashPrice, setCashPrice] = useState(0);
  const [creditPrice, setCreditPrice] = useState(0);
  const { addToCart } = useBuyListStore(
    (state) => ({
      addToCart: state.addToCart
    }),
    shallow
  );
  const { getWebsiteName, websites } = useGlobalStore(
    (state) => ({
      getWebsiteName: state.getWebsiteName,
      websites: state.websites
    }),
    shallow
  );
  useEffect(() => {
    let store = '';
    const conditionList: string[] = [];
    if (cardData.nm)
      (store = Object.keys(cardData.nm)[0]), conditionList.push('nm');
    else if (cardData.lp)
      (store = Object.keys(cardData.lp)[0]), conditionList.push('lp');
    else if (cardData.mp)
      (store = Object.keys(cardData.mp)[0]), conditionList.push('mp');
    else if (cardData.hp)
      (store = Object.keys(cardData.hp)[0]), conditionList.push('hp');
    else if (cardData.dmg)
      (store = Object.keys(cardData.dmg)[0]), conditionList.push('dmg');
    setSelectedCondition(conditionList[0]);
    setSelectedStore(store);
    setSelectableConditions(conditionList);
  }, [cardData]);

  useEffect(() => {
    if (
      cardData[selectedCondition] &&
      Object.keys(cardData[selectedCondition]).length === 0
    ) {
      setCashPrice(0);
      setCreditPrice(0);
      setSelectedStore('N/A');
    } else {
      cardData[selectedCondition] &&
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
  }, [selectedCondition, cardData, selectedStore]);
  return (
    <>
      <Card>
        <div className="border-border-colour grid grid-cols-12 rounded-md bg-popover p-4">
          <div className="col-span-3">
            <div className="flex h-full items-center justify-center">
              <div className="relative mx-auto max-w-[150px] md:max-w-[250px]">
                <CardImage imageUrl={cardData.image} alt="test image" />
              </div>
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
              <div className="flex flex-row gap-2 text-sm font-semibold capitalize text-muted-foreground">
                <p>
                  {cardData.rarity} {cardData.foil}
                </p>
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
                  <SelectTrigger className=" border-border-colour mr-2  w-1/2 uppercase focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Condition</SelectLabel>
                      {selectableConditions.map((item, key) => (
                        <SelectItem
                          key={key}
                          value={item}
                          className="uppercase"
                        >
                          {item}
                        </SelectItem>
                      ))}
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
                      rarity: cardData.rarity,
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
                    <div className="flex items-center">
                      {websites &&
                        websites.map(
                          (website, index) =>
                            selectedStore === website.slug &&
                            website.imageUrl && (
                              <img
                                src={website.imageUrl}
                                alt="Website"
                                className="h-4 w-4"
                                key={index}
                              />
                            )
                        )}
                      &nbsp;{getWebsiteName(selectedStore)}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Store</SelectLabel>
                      <SelectGroup>
                        {cardData[selectedCondition] &&
                          Object.entries(cardData[selectedCondition]).map(
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
                                          website.imageUrl && (
                                            <img
                                              src={website.imageUrl}
                                              alt="Website"
                                              className="h-4 w-4"
                                              key={index}
                                            />
                                          )
                                      )}
                                    &nbsp;
                                    {getWebsiteName(storeName)}
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
});
export default ResultCard;
