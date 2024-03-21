import React, { useEffect, useState, useRef, useCallback } from 'react';
import useWishlistStore from '@/stores/wishlistStore';
import { useDebounceCallback } from 'usehooks-ts';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
type Props = {
  wishlistId: number;
  className?: string;
};
type AutocompleteResult = {
  name: string;
  oracle_id: string;
};

export default function WishlistSearchbox({ wishlistId, className }: Props) {
  const { addCardInput, setAddCardInput, addCardToWishlist } =
    useWishlistStore();
  const autocompleteEndpoint =
    process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL + '/cards?query=';
  const [autocompleteResults, setAutocompleteResults] = useState<
    AutocompleteResult[]
  >([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] =
    useState(-1);
  const [selectedItem, setSelectedItem] = useState<AutocompleteResult | null>(
    null
  );
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchAutocompleteResults = useCallback(
    (value: string) => {
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
    },
    [autocompleteEndpoint]
  );

  const debouncedFetchResults = useDebounceCallback(
    fetchAutocompleteResults,
    500
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddCardInput(value);
    setSelectedItem(null);

    if (value.trim().length > 2) {
      debouncedFetchResults(value);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      setSelectedAutocompleteIndex(-1);
    }
  };

  const handleAutocompleteItemClick = (item: AutocompleteResult) => {
    setAddCardInput(item.name);
    // addCardToWishlist(wishlistId, item.oracle_id);
    setSelectedItem(item);
    setAutocompleteResults([]);
    setShowAutocomplete(false);
    setSelectedAutocompleteIndex(-1);
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
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item);
            item && addCardToWishlist(wishlistId, item.oracle_id);
          }
          break;

        case 'ArrowRight':
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item);
            item && addCardToWishlist(wishlistId, item.oracle_id);
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

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowAutocomplete(false);
    if (selectedItem) {
      addCardToWishlist(wishlistId, selectedItem.oracle_id);
      setSelectedItem(null); // Reset the selected item
    } else {
      // Optionally, display a message to the user indicating a selection must be made
      toast.error('Please select a card from the autocomplete list.');
    }
  };

  return (
    <div className={` w-full ${className}`}>
      <div className="relative">
        {' '}
        <form onSubmit={handleFormSubmit} className="relative flex gap-4">
          {' '}
          <Input
            type="text"
            placeholder="Search cards to add to your wishlist..."
            value={addCardInput}
            onChange={handleInputChange}
            spellCheck="false"
            ref={searchRef}
            onKeyDown={(e) => handleAutocompleteKeyDown(e)}
            className="flex-1"
          />
          <Button
            type="submit"
            className={`cursor-pointer bg-pink-500 hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-zinc-500`}
            disabled={!selectedItem}
          >
            <Search size={16} />
          </Button>
          {showAutocomplete && (
            <div className="absolute top-full z-50 mt-1 max-h-60 w-full max-w-md overflow-y-auto rounded-md border border-zinc-500 bg-zinc-700 text-left shadow-md">
              {autocompleteResults &&
                autocompleteResults.map((result, index) => (
                  <div
                    key={result.oracle_id}
                    className={`mx-1 cursor-pointer rounded px-4 py-2 ${
                      selectedAutocompleteIndex === index ? 'bg-zinc-800' : ''
                    } `}
                    onClick={() => handleAutocompleteItemClick(result)}
                  >
                    {result.name}
                  </div>
                ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
