import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

type Props = {
  createCheckoutSession: () => void;
};

const SubscriptionCards = ({ createCheckoutSession }: Props) => {
  return (
    <div className="mx-auto flex w-full flex-row gap-2">
      {/* free price card */}
      {/* should expand to match height of premium card */}
      <div className="flex w-full flex-col">
        <div className="mx-auto flex flex-col justify-center gap-6 md:flex-row">
          <div className="outlined-container neon-pink flex w-full max-w-md flex-col p-6 text-left">
            <h3 className="font-semibold text-pink-400">Pro</h3>
            <h2 className="text-2xl font-bold">
              $3.99 <span className="text-sm font-normal">/mo</span>
            </h2>
            <div className="p-1" />

            {/* description */}
            <p className="text-sm text-zinc-500">
              Support Snapcaster and get access to premium features and future
              updates.
            </p>
            <div className="p-2" />
            {/* stack for features */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-3 w-3 rounded-full bg-pink-400"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search over 60 Canadian stores
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-3 w-3 rounded-full bg-pink-400"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search up to 100 cards at a time
                </p>
              </div>
              {/* <div className="flex flex-row items-center gap-2">
              <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
              <p className="text-sm font-semibold text-zinc-400">
                Price monitoring and email notifications
              </p>
            </div> */}
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-3 w-3 rounded-full bg-pink-400"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Beta access to new features
                </p>
              </div>
            </div>
            <div className="p-4" />
            {/* upgrade now btn */}

            <p className="mb-2.5 text-xs text-zinc-400">
              By placing an order, you affirm that you have read, understood,
              and consent to the{' '}
              <a
                href="/privacy"
                target="_blank"
                className="text-pink-500 hover:text-pink-700"
              >
                Privacy Notices
              </a>{' '}
              and{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-pink-500 hover:text-pink-700"
              >
                Terms of Use
              </a>
            </p>
            <Button onClick={createCheckoutSession} className="w-full">
              Upgrade now
            </Button>
          </div>
          <div className="outlined-container flex w-full max-w-md flex-col p-6 text-left">
            <h3 className="font-semibold text-white">Free</h3>
            <h2 className="text-2xl font-bold">
              $0 <span className="text-sm font-normal">/mo</span>
            </h2>
            <div className="p-1" />

            {/* description */}
            <p className="text-sm text-zinc-500">
              Search for MTG singles across Canada.
            </p>
            <div className="p-2" />
            {/* stack for features */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-3 w-3 rounded-full bg-pink-400"></div>
                <p className="text-sm text-zinc-400">
                  Search over 60 Canadian stores
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-3 w-3 rounded-full bg-pink-400"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search up to 5 cards at a time{' '}
                </p>
              </div>
            </div>
            <div className="flex-grow p-4" />
            {/* upgrade now btn */}
            <Link className="w-full" href="/">
              <Button className="w-full">Start searching</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCards;
