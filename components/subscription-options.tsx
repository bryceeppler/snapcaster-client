import React from 'react';
import { Button } from './ui/button';

type Props = {
  createCheckoutSession: () => void;
};

const SubscriptionCards = ({ createCheckoutSession }: Props) => {
  return (
    <div className="mx-auto flex w-full flex-row gap-2">
      <div className="flex w-full flex-col">
        <div className="mx-auto flex flex-col justify-center gap-6 md:flex-row">
          {/* pro container */}
          <div className="outlined-container flex w-full flex-col p-6 text-left">
            <h3 className="font-semibold text-primary">Snapcaster Pro</h3>
            <h2 className="text-2xl font-bold">
              $2.99 <span className="text-sm font-normal">/mo</span>
            </h2>
            <div className="p-1" />

            <p className="text-sm text-card-foreground">
              Support Snapcaster and get access to premium features.
            </p>
            <div className="p-2" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search over 80 Canadian stores
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search up to 100 cards at a time with multi search
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Participate in pro member exclusive giveaways
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  See less ads
                </p>
              </div>
            </div>
            <div className="p-4" />
            <p className="mb-2.5 text-xs text-zinc-400">
              By placing an order, you affirm that you have read, understood,
              and consent to the{' '}
              <a
                href="/privacy"
                target="_blank"
                className="text-primary hover:opacity-70"
              >
                Privacy Notices
              </a>{' '}
              and{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-primary hover:opacity-70"
              >
                Terms of Use
              </a>
            </p>
            <Button onClick={createCheckoutSession} className="w-full">
              Upgrade now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCards;
