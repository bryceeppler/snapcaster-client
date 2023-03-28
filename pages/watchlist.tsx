import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import { useUser } from '@/utils/useUser';
import GlassPanel from '@/components/ui/GlassPanel';
import WatchlistHome from '@/components/WatchlistHome';
import WatchlistAdd from '@/components/WatchlistAdd';
import WatchlistEdit from '@/components/WatchlistEdit';
import {
  getPriceWatchEntries,
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
  const [intervalHours, setIntervalHours] = useState(12);
  const [cardName, setCardName] = useState('');
  const [minimumCondition, setMinimumCondition] = useState('dmg'); // NM, LP, MP, HP, DMG
  const [threshold, setThreshold] = useState(0);
  const [selectedScreen, setSelectedScreen] = React.useState('home'); // home, add, edit
  const [selectedWatchlistItem, setSelectedWatchlistItem] =
    React.useState<WatchlistItem | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // state for edit item screen
  const [editCardName, setEditCardName] = useState('');
  const [editIntervalHours, setEditIntervalHours] = useState(12);
  const [editMinimumCondition, setEditMinimumCondition] = useState('dmg'); // NM, LP, MP, HP, DMG
  const [editThreshold, setEditThreshold] = useState(0);

  const { user, subscription } = useUser();
  useEffect(() => {
    if (user) {
      getPriceWatchEntries(user).then((res) => {
        setWatchlist(res as WatchlistItem[]);
      });
    }
  }, [user]);
  useEffect(() => {
    if (selectedWatchlistItem) {
      setEditCardName(selectedWatchlistItem.card_name);
      setEditIntervalHours(selectedWatchlistItem.interval_hrs);
      setEditMinimumCondition(selectedWatchlistItem.minimum_condition);
      setEditThreshold(selectedWatchlistItem.threshold);
    }
  }, [selectedWatchlistItem]);
  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setEditCardName(value);

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
            console.error('Error fetching autocomplete results: ', error);
          });
      }
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      setSelectedAutocompleteIndex(-1);
    }
  };

  const refreshWatchlist = () => {
    if (user) {
      getPriceWatchEntries(user).then((res) => {
        setWatchlist(res as WatchlistItem[]);
      });
    }
  };
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
            console.error('Error fetching autocomplete results: ', error);
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
        case 'ArrowDown':
          event.preventDefault();
          setSelectedAutocompleteIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex < totalResults ? nextIndex : prevIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedAutocompleteIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex >= 0 ? nextIndex : -1;
          });
          break;
        case 'Enter':
          event.preventDefault();
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            if (selectedScreen === 'add') {
              setCardName(item);
            } else {
              setEditCardName(item);
            }
            setShowAutocomplete(false);
            setSelectedAutocompleteIndex(-1);
            setAutocompleteResults([]);
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            if (selectedScreen === 'add') {
              setCardName(item);
            } else {
              setEditCardName(item);
            }
            setShowAutocomplete(false);
            setSelectedAutocompleteIndex(-1);
            setAutocompleteResults([]);
          }
          break;

        case 'Escape':
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
      setSelectedAutocompleteIndex
    ]
  );
  const handleAutocompleteItemClick = (item: string) => {
    if (selectedScreen === 'add') {
      setCardName(item);
    }
    if (selectedScreen === 'edit') {
      setEditCardName(item);
    }
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
              <WatchlistHome
                watchlist={watchlist}
                setSelectedScreen={setSelectedScreen}
                setSelectedWatchlistItem={setSelectedWatchlistItem}
              />
            )}
            {selectedScreen === 'add' && (
              <WatchlistAdd
                user={user}
                cardName={cardName}
                handleInputChange={handleInputChange}
                handleAutocompleteKeyDown={handleAutocompleteKeyDown}
                showAutocomplete={showAutocomplete}
                autocompleteResults={autocompleteResults}
                selectedAutocompleteIndex={selectedAutocompleteIndex}
                handleAutocompleteItemClick={handleAutocompleteItemClick}
                intervalHours={intervalHours}
                setIntervalHours={setIntervalHours}
                threshold={threshold}
                setThreshold={setThreshold}
                minimumCondition={minimumCondition}
                setMinimumCondition={setMinimumCondition}
                searchRef={searchRef}
                setSelectedScreen={setSelectedScreen}
                setWatchlist={setWatchlist}
                subscription={subscription}
              />
            )}
            {selectedScreen === 'edit' && selectedWatchlistItem && (
              <WatchlistEdit
              refreshWatchlist={refreshWatchlist}
                user={user}
                editThreshold={editThreshold}
                editMinimumCondition={editMinimumCondition}
                setEditMinimumCondition={setEditMinimumCondition}
                setEditThreshold={setEditThreshold}
                editIntervalHours={editIntervalHours}
                setEditIntervalHours={setEditIntervalHours}
                editCardName={editCardName}
                handleEditInputChange={handleEditInputChange}
                searchRef={searchRef}
                handleAutocompleteKeyDown={handleAutocompleteKeyDown}
                showAutocomplete={showAutocomplete}
                autocompleteResults={autocompleteResults}
                selectedAutocompleteIndex={selectedAutocompleteIndex}
                handleAutocompleteItemClick={handleAutocompleteItemClick}
                selectedWatchlistItem={selectedWatchlistItem}
                subscription={subscription}
                setSelectedScreen={setSelectedScreen}
              />
            )}
          </GlassPanel>
        </div>
      </main>
    </>
  );
}
