'use client';

import Image from 'next/image';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { coreService } from '@/services/coreService';

type Item = {
  id: string;
  name: string;
  available: number;
  currency: string;
  price: number;
};

export type CartItem = Item & {
  quantity: number;
};

function MarketplacePage() {
  const results = [
    {
      id: 519305,
      productName: 'Sol Ring',
      productCategory: 'Magic: The Gathering',
      rarityName: 'Uncommon',
      sealed: false,
      setName: 'Universes Beyond: Doctor Who',
      cardNumber: '#245',
      totalListings: 2,
      imageUrl:
        'https://tcgplayer-cdn.tcgplayer.com/product/519305_in_1000x1000.jpg',
      listings: [
        {
          listingId: 100000,
          printing: 'Normal',
          productId: 519305,
          conditionId: 1,
          condition: 'Near Mint',
          languageId: 1,
          languageAbbr: 'EN',
          sellerName: 'Obsidian Games',
          sellerId: 1,
          sellerShippingPrice: 2.99,
          quantity: 1,
          price: 1.15
        },
        {
          listingId: 100001,
          printing: 'Normal',
          productId: 519305,
          conditionId: 1,
          condition: 'Near Mint',
          languageId: 1,
          languageAbbr: 'EN',
          sellerName: 'Gauntlet Games',
          sellerId: 2,
          sellerShippingPrice: 2.99,
          quantity: 2,
          price: 1.25
        }
      ]
    }
  ];
  const availableItems: Item[] = [
    {
      id: '1',
      name: 'Snapcaster Mage',
      available: 10,
      currency: 'cad',
      price: 10000 // cents
    },
    {
      id: '2',
      name: 'Fblthp, the Lost',
      available: 9,
      currency: 'cad',
      price: 495 // cents
    },
    {
      id: '3',
      name: 'Sol Ring',
      available: 2,
      currency: 'cad',
      price: 9495 // cents
    }
  ];

  const [cart, setCart] = useState<{
    items: CartItem[];
  }>({ items: [] });

  const centsToDollars = (cents: number) => {
    return cents / 100;
  };

  const formatPrice = (cents: number) => {
    return `$${centsToDollars(cents).toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* available items */}
      {results.map((item) => (
        <div className="flex flex-row gap-4" key={item.id}>
          <Card>
            <CardContent>
              <Image
                src={item.imageUrl}
                alt={item.productName}
                width={100}
                height={100}
              />
              <p>{item.productName}</p>
              <p>{item.productCategory}</p>
              <p>{item.rarityName}</p>
              <p>{item.setName}</p>
              <p>{item.cardNumber}</p>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-4">
            {item.listings.map((listing) => (
              <Card key={listing.listingId}>
                <CardContent>
                  <p>{listing.sellerName}</p>
                  <p>{listing.condition}</p>
                  <p>{listing.languageAbbr}</p>
                  <p>{listing.price}</p>
                  <p>{listing.quantity}</p>
                  <p>{listing.printing}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      {/* items in cart */}
      <Card className="p-4">
        <h2 className="text-lg font-bold">Cart</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <h3>{item.name}</h3>
            <Button
              onClick={() =>
                setCart({
                  items: cart.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                  )
                })
              }
            >
              -
            </Button>
            <p>{item.quantity}</p>

            <Button
              onClick={() =>
                setCart({
                  items: cart.items.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                  )
                })
              }
            >
              +
            </Button>
          </div>
        ))}
      </Card>
      {/* checkout button */}
      <Button
        onClick={() => {
          coreService.createCheckoutSession(cart.items);
        }}
      >
        Checkout
      </Button>
    </div>
  );
}

export default MarketplacePage;
