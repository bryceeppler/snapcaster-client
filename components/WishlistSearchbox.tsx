import React, { useEffect, useState, useRef, useCallback } from 'react';
import useWishlistStore from '@/stores/wishlistStore';
import { useDebounceCallback } from 'usehooks-ts';

import { Input } from './ui/input';
type Props = {};

export default function WishlistSearchbox({}: Props) {
  const { addCardInput, setAddCardInput, addCardToWishlist } =
    useWishlistStore();
  const autocompleteEndpoint =
    process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL + '/cards?query=';
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] =
    useState(-1);
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

    if (value.trim().length > 2) {
      debouncedFetchResults(value);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      setSelectedAutocompleteIndex(-1);
    }
  };

  const handleAutocompleteItemClick = (item: string) => {
    setAddCardInput(item);
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
            item && addCardToWishlist(1, item);
          }
          break;

        case 'ArrowRight':
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item);
            item && addCardToWishlist(1, item);
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
    if (addCardInput.trim().length > 0) {
      addCardToWishlist(1, addCardInput);
    }
  };

  return (
    <div className="mt-6 w-full">
      <div className="relative">
        <form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            placeholder="Search"
            value={addCardInput}
            onChange={handleInputChange}
            spellCheck="false"
            ref={searchRef}
            onKeyDown={(e) => handleAutocompleteKeyDown(e)}
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
          {showAutocomplete && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-300  py-1 shadow-md bg-zinc-900">
              {autocompleteResults &&
                autocompleteResults.map((result, index) => (
                  <div
                    key={result}
                    className={`cursor-pointer px-4 py-2 mx-1 rounded ${
                      selectedAutocompleteIndex === index ? 'bg-zinc-700' : ''
                    } `}
                    onClick={() => handleAutocompleteItemClick(result)}
                  >
                    {result}
                  </div>
                ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}