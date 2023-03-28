import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useUser } from '@/utils/useUser';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';
import StoreSelector from '@/components/StoreSelector';
import {
  getPriceWatchEntries,
  addPriceWatchEntry
} from '@/utils/supabase-client';

export type WatchlistItem = {
  card_name: string;
  current_price: number;
  threshold: number;
  last_checked: string;
  interval_hrs: number;
  minimum_condition: string;
};

type Props = {};

export default function Watchlist({}: Props) {
  const autocompleteEndpoint = 'https://api.scryfall.com/cards/autocomplete?q=';
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] =
    useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const [intervalHours, setIntervalHours] = useState(24);
  const [cardName, setCardName] = useState('');
  const [minimumCondition, setMinimumCondition] = useState('dmg'); // NM, LP, MP, HP, DMG
  const [threshold, setThreshold] = useState(0);
  const [selectedScreen, setSelectedScreen] = React.useState('home'); // home, add, edit
  const [selectedWatchlistItem, setSelectedWatchlistItem] =
    React.useState<WatchlistItem | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const { user, subscription } = useUser();
  useEffect(() => {
    if (user) {
      getPriceWatchEntries(user).then((res) => {
        setWatchlist(res as WatchlistItem[]);
      });
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCardName(value);

    if (value.trim().length > 0) {
      // add artificial delay, only send on odd-numbered keystrokes
      if (value.length > 2 && value.length % 2 != 0) {

      fetch(autocompleteEndpoint + value)
        .then((response) => response.json())
        .then((data) => {
          setAutocompleteResults(data.data);
          setShowAutocomplete(true);
          setSelectedAutocompleteIndex(-1);
        })
        .catch((error) => {
          console.error("Error fetching autocomplete results: ", error);
        });
      }
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      setSelectedAutocompleteIndex(-1);
    }
  };
  const handleAutocompleteKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const key = event.key;
      const totalResults = autocompleteResults.length;
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedAutocompleteIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex < totalResults ? nextIndex : prevIndex;
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedAutocompleteIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex >= 0 ? nextIndex : -1;
          });
          break;
        case "Enter":
          event.preventDefault();
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            setCardName(item);
            setShowAutocomplete(false);
            setSelectedAutocompleteIndex(-1);
            setAutocompleteResults([]);
          }
          break;

        case "ArrowRight":
          event.preventDefault();
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            setCardName(item);
            setShowAutocomplete(false);
            setSelectedAutocompleteIndex(-1);
            setAutocompleteResults([]);

          }
          break;

        case "Escape":
          setShowAutocomplete(false);
          setSelectedAutocompleteIndex(-1);
          break;
        default:
          break;
      }
    },
    [
      autocompleteResults,
      selectedAutocompleteIndex,
      setAutocompleteResults,
      setShowAutocomplete,
      setSelectedAutocompleteIndex,
    ]
  );
  const handleAutocompleteItemClick = (item: string) => {
    setCardName(item);
    setAutocompleteResults([]);
    setShowAutocomplete(false);
    setSelectedAutocompleteIndex(-1);
    
  };
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

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
            <div className="text-3xl font-extrabold mb-16">
              Log in to view your watch list.
            </div>{' '}
          </div>
        </main>
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
            {selectedScreen === 'add' && (
              <div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await addPriceWatchEntry(user, cardName, threshold, intervalHours, minimumCondition, "email", "all");
                    await getPriceWatchEntries(user).then((res) => {
                      setWatchlist(res as WatchlistItem[]);
                    });
                    setSelectedScreen('home');
                  }}
                >
                  <div className="text-xl font-extrabold">
                    Add a card to your watchlist
                  </div>
                  <div className="text-xs">
                    You can add a card to your watchlist by entering the name of
                    the card below.
                  </div>
                  <div className="mt-6 w-full">
                    <div className="relative">
                      <input
                        type="text"
                        className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                        placeholder="Search"
                        value={cardName}
                        onChange={handleInputChange}
                        spellCheck="false"
                        ref={searchRef}
                        onKeyDown={(e) => handleAutocompleteKeyDown(e)}
                        // don't submit on enter
                        
                      />
                      {showAutocomplete && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-300  py-1 shadow-md bg-zinc-900">
              {autocompleteResults &&
                autocompleteResults.map((result, index) => (
                  <div
                    key={result}
                    className={`cursor-pointer px-4 py-2 mx-1 rounded ${
                      selectedAutocompleteIndex === index ? "bg-zinc-700" : ""
                    } `}
                    onClick={() => handleAutocompleteItemClick(result)}
                  >
                    {result}
                  </div>
                ))}
            </div>
          )}
                    </div>
                  </div>
                  {/* Settings */}
                  <div className="mt-6">
                    <div className="text-xl font-extrabold">Settings</div>
                    <div className="text-xs mb-2">
                      You can set the price threshold for this card. If the
                      price of the card drops below this threshold, you will be
                      notified.
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
                        value={intervalHours}
                        onChange={(e) => setIntervalHours(parseInt(e.target.value))}
                      >
                        <option
                          value={2}
                          disabled={subscription === null}
                        >{`2 hours ${subscription === null ? "(Pro members only)":""}`}</option>
                        <option
                          value={12}
                          disabled={subscription === null}
                        >{`12 hours ${subscription === null ? "(Pro members only)":""}`}</option>
                        <option
                          value={24}
                        >24 hours</option>
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
                        placeholder="0.00"
                        value={threshold}
                        onChange={(e) =>
                          setThreshold(parseFloat(e.target.value))
                        }
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
                        value={minimumCondition}
                        onChange={(e) => setMinimumCondition(e.target.value)}
                      >
                        <option
                          value={'nm'}
                        >NM</option>
                        <option
                          value={'lp'}
                        >LP</option>
                        <option
                          value={'mp'}
                        >MP</option>
                        <option
                          value={'hp'}
                        >HP</option>
                        <option
                          value={'dmg'}
                        >DMG</option>
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
                        <option disabled>SMS</option>
                      </select>
                    </div>
                  </div>

                  {/* Stores */}
                  <div className="mt-6">
                    <div className="text-xl font-extrabold">Stores</div>
                    <div className="text-xs mb-2">
                      You can select which stores you want to monitor for this
                      card. If you don't select any stores, all stores will be
                      monitored.
                    </div>
                    <StoreSelector />
                  </div>

                  {/* Disclaimer */}
                  <p className="text-xs my-2">
                    Please note that I cannot guarantee the accuracy or
                    completeness of the data used for price monitoring. This
                    service is provided on a best-effort basis and relies on the
                    availability and status of the websites being scraped. As
                    the web scrapers depend on the structure of the vendor's
                    websites, it is important to understand that changes or
                    updates to these websites may impact the accuracy and
                    functionality of our scrapers. I aim to update and maintain
                    the web scrapers to accommodate these changes, but there may
                    be periods of time when data accuracy is affected. By using
                    this service, you acknowledge these limitations and agree to
                    use the information provided at your own discretion and
                    risk.
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
                      type="submit"
                      color="primary"
                      className=""
                      variant="slim"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}
            {selectedScreen === 'edit' && selectedWatchlistItem && (
              <WatchlistEdit watchlistItem={selectedWatchlistItem} />
            )}
          </GlassPanel>
        </div>
      </main>
    </>
  );

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

  function WatchlistEdit({ watchlistItem }: { watchlistItem: WatchlistItem }) {
    return (
      <div>
        <div className="text-xl font-extrabold">Edit Watchlist Item</div>
        <div className="text-xs mb-2">
          You can edit the details of your watchlist item here.
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col w-full">
            {/* Card name */}
            <label
              htmlFor="name"
              className="block mt-4 text-sm font-medium text-white"
            >
              Card Name
            </label>








                  <div className="w-full">
                    <div className="relative">
                      <input
                        type="text"
                        className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                        // placeholder="Search"
                        // value={cardName}
                        // onChange={handleInputChange}
                        // spellCheck="false"
                        // ref={searchRef}
                        // onKeyDown={(e) => handleAutocompleteKeyDown(e)}
                        defaultValue={watchlistItem.card_name}
                        // don't submit on enter
                        
                      />
                      {showAutocomplete && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-300  py-1 shadow-md bg-zinc-900">
              {autocompleteResults &&
                autocompleteResults.map((result, index) => (
                  <div
                    key={result}
                    className={`cursor-pointer px-4 py-2 mx-1 rounded ${
                      selectedAutocompleteIndex === index ? "bg-zinc-700" : ""
                    } `}
                    onClick={() => handleAutocompleteItemClick(result)}
                  >
                    {result}
                  </div>
                ))}
            </div>
          )}
                    </div>
                  </div>
                  {/* Settings */}
                  <div className="mt-6">
                    <div className="text-xl font-extrabold">Settings</div>
                
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
                        defaultValue={watchlistItem.interval_hrs}
                        // value={intervalHours}
                        // onChange={(e) => setIntervalHours(parseInt(e.target.value))}
                      >
                        <option
                          value={2}
                          disabled={subscription === null}
                        >{`2 hours ${subscription === null ? "(Pro members only)":""}`}</option>
                        <option
                          value={12}
                          disabled={subscription === null}
                        >{`12 hours ${subscription === null ? "(Pro members only)":""}`}</option>
                        <option
                          value={24}
                        >24 hours</option>
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
                        placeholder={watchlistItem.threshold.toString()}
                        disabled
                        // value={threshold}
                        // onChange={(e) =>
                        //   setThreshold(parseFloat(e.target.value))
                        // }
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
                        placeholder={watchlistItem.minimum_condition}
                        // value={minimumCondition}
                        // onChange={(e) => setMinimumCondition(e.target.value)}
                      >
                        <option
                          value={'nm'}
                        >NM</option>
                        <option
                          value={'lp'}
                        >LP</option>
                        <option
                          value={'mp'}
                        >MP</option>
                        <option
                          value={'hp'}
                        >HP</option>
                        <option
                          value={'dmg'}
                        >DMG</option>
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
                        <option disabled>SMS</option>
                      </select>
                    </div>
                  </div>

                  {/* Stores */}
                  <div className="mt-6">
                    <div className="text-xl font-extrabold">Stores</div>
                    <div className="text-xs mb-2">
                      You can select which stores you want to monitor for this
                      card. If you don't select any stores, all stores will be
                      monitored.
                    </div>
                    <StoreSelector />
                  </div>







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
