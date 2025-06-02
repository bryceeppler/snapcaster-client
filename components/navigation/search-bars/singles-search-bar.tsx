'use client';

import type { KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import type { DeviceType } from '../../../types/navbar';

import BaseSearchBar from '@/components/ui/base-search-bar';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import type { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';

/**
 * Singles search bar component that connects to the single search store
 */
export default function SinglesSearchBar({
  deviceType
}: {
  deviceType: DeviceType;
}) {
  const {
    searchTerm,
    tcg,
    loadingCardResults,
    fetchCards,
    setSearchTerm,
    setTcg,
    clearFilters,
    setIsLoading
  } = useSingleSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<
    {
      name: string;
    }[]
  >([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;
  const MIN_SEARCH_LENGTH = 3;
  const DEBOUNCE_MS = 300;

  // Fetch autocomplete results
  const fetchAutocomplete = useCallback(
    async (value: string) => {
      if (value.trim().length < MIN_SEARCH_LENGTH) {
        setSuggestions([]);
        setIsAutoCompleteVisible(false);
        return;
      }

      try {
        const url = `${autoCompleteUrl}/cards?tcg=${tcg}&query=${encodeURIComponent(
          value
        )}`;
        const response = await fetch(url);
        const data = await response.json();

        setSuggestions(data.data);
        setIsAutoCompleteVisible(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching autocomplete results: ', error);
        setSuggestions([]);
      }
    },
    [autoCompleteUrl, tcg]
  );

  // Debounced autocomplete
  const debouncedAutoCompleteResults = useDebounceCallback(
    fetchAutocomplete,
    DEBOUNCE_MS
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedAutoCompleteResults(value);
  };

  // Handle key navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Skip navigation if no suggestions
    if (suggestions.length === 0) return;

    const key = event.key;
    const totalResults = suggestions.length;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prevIndex) => (prevIndex + 1) % totalResults);
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex <= 0 ? totalResults - 1 : prevIndex - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        clearFilters();
        setIsLoading(true);
        fetchCards();
        setIsAutoCompleteVisible(false);
        trackSearch('singles', searchTerm, tcg);
        break;

      case 'Escape':
        setIsAutoCompleteVisible(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle search button click
  const handleSearch = () => {
    clearFilters();
    setIsLoading(true);
    fetchCards();
    setIsAutoCompleteVisible(false);
    trackSearch('singles', searchTerm, tcg);
  };

  // Handle TCG change
  const handleTcgChange = (value: Tcg) => {
    setTcg(value);
    setSearchTerm('');
    setSuggestions([]);
    setIsAutoCompleteVisible(false);
  };

  // Render autocomplete suggestions
  const renderAutoComplete = () => {
    if (!isAutoCompleteVisible || suggestions.length === 0) {
      return null;
    }

    return (
      <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-md">
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.name}-${index}`}
              className={`cursor-pointer rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : ''
              }`}
              onClick={() => {
                setSearchTerm(suggestion.name);
                trackSearch('singles', suggestion.name, tcg);
                setIsAutoCompleteVisible(false);
                clearFilters();
                fetchCards();
              }}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <BaseSearchBar
      deviceType={deviceType}
      tcg={tcg}
      searchTerm={searchTerm}
      placeholder="Search for a card"
      isLoading={loadingCardResults}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={handleSearch}
      renderAutoComplete={renderAutoComplete}
    />
  );
}
