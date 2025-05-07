import {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback
} from 'react';
import useBuylistStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';
import BaseSearchBar, { DeviceType } from '../ui/base-search-bar';

interface AutocompleteResult {
  name: string;
}

type Props = {
  deviceType: string;
  toggleMobileSearch?: () => void;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setTcg: (tcg: Tcg) => void;
  tcg: Tcg;
};

export default function BuylistNavSearchBar({
  deviceType,
  toggleMobileSearch,
  setSearchTerm,
  searchTerm,
  setTcg,
  tcg
}: Props) {
  const { filters, sortBy, clearFilters, buylistUIState, setBuylistUIState } =
    useBuylistStore();

  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const autoCompleteRef = useRef<HTMLDivElement>(null);
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

  // Memoize the fetch function to prevent recreating on every render
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

  // Create a debounced version of the fetch function
  const debouncedAutoCompleteResults = useDebounceCallback(
    fetchAutocomplete,
    DEBOUNCE_MS
  );

  // Handle input changes with local state to prevent re-renders
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setIsTyping(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to update the actual search term
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setSearchTerm(value);
    }, 500);

    // Only fetch suggestions if the input is long enough
    if (value.trim().length >= MIN_SEARCH_LENGTH) {
      debouncedAutoCompleteResults(value);
    } else {
      setSuggestions([]);
      setIsAutoCompleteVisible(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = useCallback(
    (suggestion: AutocompleteResult) => {
      setInputValue(suggestion.name);
      setSearchTerm(suggestion.name);
      setIsAutoCompleteVisible(false);
    },
    [setSearchTerm]
  );

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
          event.stopPropagation();
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
          break;

        case 'ArrowRight':
          if (selectedIndex >= 0 && selectedIndex < totalResults) {
            event.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
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
      setBuylistUIState
    ]
  );

  // Handle clicks outside the autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autoCompleteRef.current &&
        !autoCompleteRef.current.contains(event.target as Node)
      ) {
        setIsAutoCompleteVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Update input value when searchTerm changes externally
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleTcgChange = (value: Tcg) => {
    clearFilters();
    setTcg(value);
    setSearchTerm('');
    setInputValue('');
    setSuggestions([]);
    setIsAutoCompleteVisible(false);
    setSelectedIndex(-1);
  };

  const handleSearchClick = () => {
    clearFilters();
    refetch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (
      buylistUIState === 'viewAllOffersState' ||
      buylistUIState === 'finalSubmissionState'
    ) {
      setBuylistUIState('searchResultsState');
    }
  };

  // Render autocomplete suggestions
  const renderAutoComplete = () => {
    if (!isAutoCompleteVisible || !suggestions || suggestions.length === 0) {
      return null;
    }

    return (
      <div
        ref={autoCompleteRef}
        className="absolute left-0 right-0 top-full z-50 mt-[6px] rounded-b-md border bg-popover p-1 text-foreground shadow-lg"
      >
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`cursor-pointer px-4 py-2 ${
              selectedIndex === index
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <BaseSearchBar
      deviceType={deviceType as DeviceType}
      tcg={tcg}
      searchTerm={inputValue}
      placeholder="Search for a card"
      isLoading={isLoading}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={handleSearchClick}
      renderAutoComplete={renderAutoComplete}
      showSearchHelp={false}
    />
  );
}
