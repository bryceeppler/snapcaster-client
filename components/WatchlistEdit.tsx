import React from 'react';
import StoreSelector from './StoreSelector';
import Button from './ui/Button';
import {
  deletePriceWatchEntry,
  getPriceWatchEntries,
  updatePriceWatchEntry
} from '@/utils/supabase-client';
import { User } from '@supabase/supabase-js';
import CloseButton from './CloseButton';

interface WatchlistEditProps {
  editCardName: string;
  handleEditInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchRef: React.RefObject<HTMLInputElement>;
  handleAutocompleteKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  showAutocomplete: boolean;
  autocompleteResults: string[];
  selectedAutocompleteIndex: number;
  handleAutocompleteItemClick: (result: string) => void;
  selectedWatchlistItem: any; // Replace 'any' with the appropriate type for selectedWatchlistItem
  subscription: any; // Replace 'any' with the appropriate type for subscription
  setSelectedScreen: (screen: string) => void;
  editIntervalHours: number;
  setEditIntervalHours: (interval: number) => void;
  editThreshold: number;
  editMinimumCondition: string;
  setEditMinimumCondition: (condition: string) => void;
  setEditThreshold: (threshold: number) => void;
  user: User;
  refreshWatchlist: () => void;
}

const WatchlistEdit: React.FC<WatchlistEditProps> = ({
  refreshWatchlist,
  editCardName,
  handleEditInputChange,
  searchRef,
  handleAutocompleteKeyDown,
  showAutocomplete,
  autocompleteResults,
  selectedAutocompleteIndex,
  handleAutocompleteItemClick,
  selectedWatchlistItem,
  subscription,
  setSelectedScreen,
  editIntervalHours,
  setEditIntervalHours,
  editThreshold,
  editMinimumCondition,
  setEditMinimumCondition,
  setEditThreshold,
  user
}) => {
  const handleSubmit = async () => {
    await updatePriceWatchEntry(
      user,
      selectedWatchlistItem.id,
      editCardName,
      editIntervalHours,
      editThreshold,
      editMinimumCondition,
      'email',
      selectedWatchlistItem.websites
    );

    // refresh the watchlist
    refreshWatchlist();

    setSelectedScreen('home');
  };

  const handleDelete = async () => {
    await deletePriceWatchEntry(user, selectedWatchlistItem.id);
  };
  return (
    <div>
      <div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-xl font-extrabold">Edit Watchlist Item</div>
            <div className="text-xs mb-2">
              You can edit the details of your watchlist item here.
            </div>
          </div>
          <CloseButton
            onClick={() => {
              setSelectedScreen('home');
            }}
          ></CloseButton>
        </div>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col w-full">
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
                  placeholder="Search"
                  value={editCardName}
                  onChange={handleEditInputChange}
                  spellCheck="false"
                  ref={searchRef}
                  onKeyDown={(e) => handleAutocompleteKeyDown(e)}
                  //   defaultValue={selectedWatchlistItem.card_name}
                  // don't submit on enter
                />
                {showAutocomplete && (
                  <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-300  py-1 shadow-md bg-zinc-900">
                    {autocompleteResults &&
                      autocompleteResults.map((result, index) => (
                        <div
                          key={result}
                          className={`cursor-pointer px-4 py-2 mx-1 rounded ${
                            selectedAutocompleteIndex === index
                              ? 'bg-zinc-700'
                              : ''
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
                  value={editIntervalHours}
                  onChange={(e) =>
                    setEditIntervalHours(parseInt(e.target.value))
                  }
                >
                  <option
                    value={2}
                    disabled={subscription === null}
                  >{`2 hours ${
                    subscription === null ? '(Pro members only)' : ''
                  }`}</option>
                  <option
                    value={12}
                    disabled={subscription === null}
                  >{`12 hours ${
                    subscription === null ? '(Pro members only)' : ''
                  }`}</option>
                  <option value={24}>24 hours</option>
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
                  step="0.1"
                  min="0"
                  //   disabled
                  value={editThreshold}
                  onChange={(e) =>
                    setEditThreshold(parseFloat(e.target.value) || 0)
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
                  value={editMinimumCondition}
                  onChange={(e) => setEditMinimumCondition(e.target.value)}
                >
                  <option value={'nm'}>NM</option>
                  <option value={'lp'}>LP</option>
                  <option value={'mp'}>MP</option>
                  <option value={'hp'}>HP</option>
                  <option value={'dmg'}>DMG</option>
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
                You can select which stores you want to monitor for this card.
                If you don't select any stores, all stores will be monitored.
              </div>
              <StoreSelector />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center space-x-6 mt-6">
        <Button
            onClick={async () => {
              await deletePriceWatchEntry(user, selectedWatchlistItem.id);
              refreshWatchlist();
              setSelectedScreen('home');
            }}
            className=""
            variant="error"
          >
           Delete 
          </Button>
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
              handleSubmit();
            }}
            color="primary"
            className=""
            variant="slim"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WatchlistEdit;
