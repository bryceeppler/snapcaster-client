import React, { useEffect, useState, useRef, useCallback } from "react";
import { useStore } from "store";

type Props = {};

export default function SingleSearchbox({}: Props) {
  const { singleSearchInput, setSingleSearchInput, fetchSingleSearchResults } =
    useStore();
  const autocompleteEndpoint = "https://api.scryfall.com/cards/autocomplete?q=";
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
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
          console.log("data", data);
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
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item);
            item && fetchSingleSearchResults(item);
          }
          break;

        case "ArrowRight":
          if (
            selectedAutocompleteIndex >= 0 &&
            selectedAutocompleteIndex < totalResults
          ) {
            const item = autocompleteResults[selectedAutocompleteIndex];
            item && handleAutocompleteItemClick(item);
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
          <input
            type="text"
            className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
            placeholder="Search"
            value={singleSearchInput}
            onChange={handleInputChange}
            spellCheck="false"
            ref={searchRef}
            onKeyDown={(e) => handleAutocompleteKeyDown(e)}
          />
          {showAutocomplete && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-300  py-1 shadow-md">
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
        </form>
      </div>
    </div>
  );
}
