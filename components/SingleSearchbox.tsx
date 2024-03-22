import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '@/stores/store';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
type Props = {};
interface AutocompleteResult {
  name: string;
  oracle_id: string;
}
export default function SingleSearchbox({}: Props) {
  const { singleSearchInput, setSingleSearchInput, fetchSingleSearchResults } =
    useStore();
  const autocompleteEndpoint =
    process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL + '/cards?query=';
  const [autocompleteResults, setAutocompleteResults] = useState<
    AutocompleteResult[]
  >([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] =
    useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSingleSearchInput(value);

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

  const handleAutocompleteItemClick = (item: string) => {
    setSingleSearchInput(item);
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
            item && handleAutocompleteItemClick(item.name);
            item && fetchSingleSearchResults(item.name);
          }
          break;

        case 'ArrowRight':
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item.name);
            item && fetchSingleSearchResults(item.name);
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
    if (singleSearchInput.trim().length > 0) {
      fetchSingleSearchResults(singleSearchInput);
    }
  };

  return (
    <div className="mt-6 w-full">
      <div className="relative">
        <form onSubmit={handleFormSubmit}>
          <Input
            type="text"
            placeholder="Search"
            value={singleSearchInput}
            onChange={handleInputChange}
            spellCheck="false"
            ref={searchRef}
            onKeyDown={(e) => handleAutocompleteKeyDown(e)}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-pink-500"
          >
            <Search size={15} />
          </button>
          {showAutocomplete && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-500  bg-zinc-700 py-1 shadow-md">
              {autocompleteResults &&
                autocompleteResults.map((result, index) => (
                  <div
                    key={index}
                    className={`mx-1 cursor-pointer rounded px-4 py-2 ${
                      selectedAutocompleteIndex === index ? 'bg-zinc-800' : ''
                    } `}
                    onClick={() => handleAutocompleteItemClick(result.name)}
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
