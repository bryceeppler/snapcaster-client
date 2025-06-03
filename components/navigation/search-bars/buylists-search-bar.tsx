'use client';

import type { KeyboardEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import BaseSearchBar from '@/components/ui/base-search-bar';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import useBuyListStore from '@/stores/useBuylistStore';
import type { Tcg } from '@/types';
import type { DeviceType } from '@/types/navbar';
import { trackSearch } from '@/utils/analytics';

interface AutocompleteResult {
  name: string;
}

/**
 * Buylists search bar component that connects to the buylist store
 */
export default function BuylistsSearchBar({
  deviceType
}: {
  deviceType: DeviceType;
}) {
  const {
    searchTerm,
    tcg,
    filters,
    sortBy,
    clearFilters,
    setSearchTerm,
    setTcg,
    buylistUIState,
    setBuylistUIState
  } = useBuyListStore();

  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;
  const MIN_SEARCH_LENGTH = 3;
  const DEBOUNCE_MS = 300;

  const { isLoading, refetch } = useBuylistSearch(
    {
      tcg,
      searchTerm,
      filters: filters ?? [],
      sortBy
    },
    { enabled: false }
  );

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

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: AutocompleteResult) => {
      setSearchTerm(suggestion.name);
      trackSearch('buylists', suggestion.name, tcg);
      setIsAutoCompleteVisible(false);
      clearFilters();
      refetch();

      if (
        buylistUIState === 'viewAllOffersState' ||
        buylistUIState === 'finalSubmissionState'
      ) {
        setBuylistUIState('searchResultsState');
      }

      // Track the search
      trackSearch('buylists', suggestion.name, tcg);
    },
    [
      setSearchTerm,
      clearFilters,
      refetch,
      buylistUIState,
      setBuylistUIState,
      tcg
    ]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedAutoCompleteResults(value);

    // Set typing state with debounce to prevent UI jitter
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  // Handle key navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // Skip navigation if no suggestions or typing
      if (suggestions.length === 0 || isTyping) return;

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
          refetch();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (
            buylistUIState === 'viewAllOffersState' ||
            buylistUIState === 'finalSubmissionState'
          ) {
            setBuylistUIState('searchResultsState');
          }
          setIsAutoCompleteVisible(false);
          trackSearch('buylists', searchTerm, tcg);
          break;

        case 'ArrowRight':
          if (selectedIndex >= 0 && selectedIndex < totalResults) {
            event.preventDefault();
            const suggestion = suggestions[selectedIndex];
            if (suggestion) {
              handleSuggestionClick(suggestion);
            }
          }
          break;

        case 'Escape':
          setIsAutoCompleteVisible(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [
      suggestions,
      selectedIndex,
      handleSuggestionClick,
      isTyping,
      clearFilters,
      refetch,
      buylistUIState,
      setBuylistUIState,
      searchTerm,
      tcg
    ]
  );

  // Handle search button click
  const handleSearch = () => {
    clearFilters();
    refetch();
    setIsAutoCompleteVisible(false);

    if (
      buylistUIState === 'viewAllOffersState' ||
      buylistUIState === 'finalSubmissionState'
    ) {
      setBuylistUIState('searchResultsState');
    }

    // Track the search
    trackSearch('buylists', searchTerm, tcg);
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
              onClick={() => handleSuggestionClick(suggestion)}
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
      isLoading={isLoading}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={handleSearch}
      renderAutoComplete={renderAutoComplete}
    />
  );
}
