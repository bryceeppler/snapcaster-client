'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      {availableItems.map((item) => (
        <Card key={item.id} className="p-4">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.available} available</p>
          <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
          <Button
            onClick={() =>
              setCart({
                items: [...cart.items, { ...item, quantity: 1 }]
              })
            }
          >
            Add to cart
          </Button>
        </Card>
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
