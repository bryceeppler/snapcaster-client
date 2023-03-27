import React, {useState, useEffect, use} from 'react';
import Head from 'next/head';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';
import { useStore } from '@/store';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';
import StoreSelector from '@/components/StoreSelector';
import { getPriceWatchEntries } from '@/utils/supabase-client';

export type WatchlistItem = {
  card_name: string;
  current_price: number;
  threshold: number;
  last_checked: string;
};

type Props = {};
const dummyWatchList = [
  {
    name: 'Dockside Extortionist',
    currentPrice: 76.87,
    priceThreshold: 75,
    lastUpdated: '2021-07-01T09:21'
  },
  {
    name: 'Craterhoof Behemoth',
    currentPrice: 72.87,
    priceThreshold: 75,
    lastUpdated: '2021-07-01T09:35'
  }
];
export default function Watchlist({}: Props) {
  const [selectedScreen, setSelectedScreen] = React.useState('home'); // home, add, edit
  const [selectedWatchlistItem, setSelectedWatchlistItem] = React.useState<WatchlistItem | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      getPriceWatchEntries(user).then((res) => {
        setWatchlist(res as WatchlistItem[]);
      });
    }
  }, [user]);
 
  if (!user) {
    return (
      <>
            <Head>
        <title>Price Watchlist - snapcaster</title>
        <meta
          name="description"
          content="Search Magic the Gathering sealed products in Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center px-2 py-8 sm:p-8 min-h-screen">
        <div className="flex-col justify-center flex-1 text-center max-w-xl w-full">
          <div className="text-3xl font-extrabold mb-16">Log in to view your watch list.</div>{' '}
          </div></main>
          </>
    );
  }
  return (
    <>
      <Head>
        <title>Price Watchlist - snapcaster</title>
        <meta
          name="description"
          content="Search Magic the Gathering sealed products in Canada"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-between items-center px-2 py-8 sm:p-8 min-h-screen">
        <div className="flex-col justify-center flex-1 text-center max-w-xl w-full">
          <div className="text-3xl font-extrabold mb-16">Price Monitoring</div>{' '}
          <GlassPanel color={'dark'} tailwindProps="text-left px-6">
            {selectedScreen === 'home' && (
              <WatchListHome watchlist={watchlist} />
            )}
            {selectedScreen === 'add' && <WatchlistAdd />}
            {selectedScreen === 'edit' && selectedWatchlistItem && (
              <WatchlistEdit watchlistItem={selectedWatchlistItem} />
            )}
          </GlassPanel>
        </div>
      </main>
    </>
  );

  function WatchlistAdd() {
    return (
      <div>
        <div className="text-xl font-extrabold">
          Add a card to your watchlist
        </div>
        <div className="text-xs">
          You can add a card to your watchlist by entering the name of the card
          below.
        </div>
        <div className="mt-6 w-full">
          <div className="relative">
            <form>
              <input
                type="text"
                className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                placeholder="Search"
                spellCheck="false"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-pink-500"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
        {/* Settings */}
        <div className="mt-6">
          <div className="text-xl font-extrabold">Settings</div>
          <div className="text-xs mb-2">
            You can set the price threshold for this card. If the price of the
            card drops below this threshold, you will be notified.
          </div>
          <div>
            {/* Interval selector */}
            <label
              htmlFor="interval"
              className="block text-sm font-medium text-white"
            >
              Check Interval
            </label>
            <select
              id="interval"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md bg-zinc-800"
            >
              <option>2 hours</option>
              <option>12 hours</option>
              <option>24 hours</option>
            </select>

            {/* Price input field */}
            <label
              htmlFor="price"
              className="block mt-4 text-sm font-medium text-white"
            >
              Price Threshold (CAD)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm bg-zinc-800"
            />

            {/* Condition selector */}
            <label
              htmlFor="condition"
              className="block mt-4 text-sm font-medium text-white"
            >
              Minimum Card Condition
            </label>
            <select
              id="condition"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md bg-zinc-800"
            >
              <option>NM</option>
              <option>LP</option>
              <option>MP</option>
              <option>HP</option>
              <option>DMG</option>
            </select>

            {/* Notification method selector */}
            <label
              htmlFor="notification"
              className="block mt-4 text-sm font-medium text-white"
            >
              Notify me via
            </label>
            <select
              id="notification"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md bg-zinc-800"
            >
              <option>Email</option>
              <option>SMS</option>
            </select>
          </div>
        </div>

        {/* Stores */}
        <div className="mt-6">
          <div className="text-xl font-extrabold">Stores</div>
          <div className="text-xs mb-2">
            You can select which stores you want to monitor for this card. If
            you don't select any stores, all stores will be monitored.
          </div>
          <StoreSelector />
        </div>

        {/* Disclaimer */}
        <p className="text-xs my-2">
          Please note that I cannot guarantee the accuracy or completeness of
          the data used for price monitoring. This service is provided on a
          best-effort basis and relies on the availability and status of the
          websites being scraped. As the web scrapers depend on the structure of
          the vendor's websites, it is important to understand that changes or
          updates to these websites may impact the accuracy and functionality of
          our scrapers. I aim to update and maintain the web scrapers to
          accommodate these changes, but there may be periods of time when data
          accuracy is affected. By using this service, you acknowledge these
          limitations and agree to use the information provided at your own
          discretion and risk.
        </p>
        <div className="w-full flex justify-center space-x-6 mt-6">
          <Button
            onClick={() => {
              setSelectedScreen('home');
            }}
            color="primary"
            className=""
            variant="slim"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSelectedScreen('home');
            }}
            color="primary"
            className=""
            variant="slim"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  function WatchListHome({ watchlist }: { watchlist: WatchlistItem[] }) {
    return (
      <div>
        <div className="text-xl font-extrabold">Watchlist</div>
        {watchlist.length > 0 ? (
          <div className="my-4">
            <div className="text-xs mb-2">
              You have {watchlist.length} cards on your watchlist.
            </div>
            <div className="flex flex-col space-y-4">
              {watchlist.map((item, index) => (
                <GlassPanel
                  color={'light'}
                  tailwindProps={`bg-white bg-opacity-10 hover:bg-opacity-0 transition-all ${
                    item.current_price < item.threshold
                      ? 'outline-green-500'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedScreen('edit');
                    setSelectedWatchlistItem(item);
                  }}
                  key={index}
                >
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div className="text-sm font-bold">{item.card_name}</div>
                      <div className="text-sm">
                        Current price: ${item.current_price}
                      </div>
                    </div>
                    <div className="flex flex-col text-right">
                      <div className="text-sm">
                        Last checked: {item.last_checked}
                      </div>
                      <div className="text-sm">
                        Price threshold: ${item.threshold}
                      </div>
                      <div
                        className={`text-sm ${
                          item.current_price < item.threshold
                            ? 'text-green-500'
                            : 'text-yellow-500'
                        }`}
                      >
                        {item.current_price < item.threshold
                          ? 'Below threshold'
                          : 'Above threshold'}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-md">
            You don't have any cards on your watchlist yet.
          </div>
        )}

        <Button
          onClick={() => {
            setSelectedScreen('add');
          }}
          color="primary"
          className="mt-2"
          variant="slim"
        >
          Add a card
        </Button>
      </div>
    );
  }

  function WatchlistEdit( { watchlistItem }: { watchlistItem: WatchlistItem }) {
    return (
      <div>
        <div className="text-xl font-extrabold">Edit Watchlist Item</div>
        <div className="text-xs mb-2">
          You can edit the details of your watchlist item here.
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col w-1/2">
            {/* Card name */}
            <label
              htmlFor="name"
              className="block mt-4 text-sm font-medium text-white"
            >
              Card Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md bg-zinc-800"
              placeholder="Card Name"
              defaultValue={watchlistItem.card_name}
            />
          </div>
        </div>
        <div className="w-full flex justify-center space-x-6 mt-6">
          <Button
            onClick={() => {
              setSelectedScreen('home');
            }}
            color="primary"
            className=""
            variant="slim"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setSelectedScreen('home');
            }}
            color="primary"
            className=""
            variant="slim"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
