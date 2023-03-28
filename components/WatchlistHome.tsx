import { WatchlistItem } from '@/pages/watchlist';
import React from 'react';
import GlassPanel from '@/components/ui/GlassPanel';
import Button from '@/components/ui/Button';

type Props = {
  watchlist: WatchlistItem[];
  setSelectedScreen: (screen: string) => void;
  setSelectedWatchlistItem: (item: WatchlistItem | null) => void;
};

const WatchlistHome: React.FC<Props> = ({
  watchlist,
  setSelectedScreen,
  setSelectedWatchlistItem
}) => {
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
                  item.current_price < item.threshold ? 'outline-green-500' : ''
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
};

export default WatchlistHome;