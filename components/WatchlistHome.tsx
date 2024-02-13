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
            You have {watchlist.length} cards on your watchlist. This feature is
            in testing and card prices refresh every 12 hours.
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
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="flex flex-col">
                    <div className="text-sm font-bold">{item.card_name}</div>
                    <div className="text-sm">
                      Price threshold: ${item.threshold}
                    </div>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <div className="text-sm">
                      Current price: ${item.current_price}
                    </div>{' '}
                    <div
                      className={`text-sm ${
                        item.current_price < item.threshold &&
                        item.current_price != null
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }`}
                    >
                      {item.current_price < item.threshold &&
                      item.current_price != null
                        ? 'Below threshold'
                        : item.current_price === null
                        ? 'No price data yet'
                        : 'Above threshold'}
                    </div>
                    <div className="text-sm text-zinc-500">
                      Updated:{' '}
                      {new Date(
                        new Date(item.last_checked).getTime() - 25200000
                      ).toLocaleString()}
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
{/* 
      <Button
        onClick={() => {
          setSelectedScreen('add');
        }}
        color="primary"
        className="mt-2"
        variant="slim"
      >
        Add a card
      </Button> */}
    </div>
  );
};

export default WatchlistHome;
