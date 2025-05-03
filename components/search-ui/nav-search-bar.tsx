import {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback,
  useMemo
} from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';
import BaseSearchBar, { DeviceType } from '../ui/base-search-bar';

interface AutocompleteResult {
  name: string;
}

type Props = {
  deviceType: string;
  toggleMobileSearch?: () => void;
  fetchQuery: (page: number) => void;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setTcg: (tcg: Tcg) => void;
  tcg: Tcg;
  clearFilters: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export default function NavSearchBar({
  deviceType,
  toggleMobileSearch,
  fetchQuery,
  setSearchTerm,
  searchTerm,
  setTcg,
  tcg,
  clearFilters,
  isLoading,
  setIsLoading
}: Props) {
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;

  //Autocomplete Logic
  const fetchAutocomplete = useCallback(
    (value: string) => {
      const url = `${autoCompleteUrl}/cards?tcg=${tcg}&query=${encodeURIComponent(
        value
      )}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data.data);
          setIsAutoCompleteVisible(true);
          setSelectedIndex(-1);
        })
        .catch((error) => {
          console.error('Error fetching autocomplete results: ', error);
        });
    },
    [autoCompleteUrl, tcg]
  );
  const debouncedAutoCompleteResults = useDebounceCallback(
    fetchAutocomplete,
    200
  );

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim().length > 2) {
      debouncedAutoCompleteResults(value);
    } else {
      setSuggestions([]);
      setIsAutoCompleteVisible(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setSearchTerm(suggestion.name);
    setIsAutoCompleteVisible(false);
    handleSearch(); // Trigger search
  };

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    clearFilters();
    await fetchQuery(1);
    trackSearch(searchTerm, tcg, 'single');
    setIsAutoCompleteVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoading(false);
  }, [fetchQuery, searchTerm, tcg, clearFilters, setIsLoading]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const key = event.key;
      const totalResults = suggestions?.length || 0;

      switch (key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            return nextIndex < totalResults ? nextIndex : 0;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex >= 0 ? nextIndex : suggestions.length - 1;
          });
          break;
        case 'Enter':
        case 'ArrowRight':
          if (selectedIndex >= 0 && selectedIndex < totalResults) {
            const item = suggestions[selectedIndex];
            if (item) {
              handleSuggestionClick(item);
            }
          } else {
            clearFilters();
            handleSearch();
          }
          break;
        case 'Escape':
          setIsAutoCompleteVisible(false);
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    },
    [
      suggestions,
      selectedIndex,
      handleSuggestionClick,
      clearFilters,
      handleSearch
    ]
  );

  const handleTcgChange = (value: Tcg) => {
    setTcg(value);
    setSearchTerm('');
    setSuggestions([]);
    setIsAutoCompleteVisible(false);
    setSelectedIndex(-1);
  };

  // Render autocomplete suggestions
  const renderAutoComplete = () => {
    if (!isAutoCompleteVisible || suggestions.length === 0) return null;

    return (
      <div
        ref={autoCompleteRef}
        className="absolute left-0 right-0 top-full z-50 mt-[6px] rounded-b-md border bg-popover p-1 text-foreground shadow-lg "
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
      searchTerm={searchTerm}
      placeholder="Search for a card"
      isLoading={isLoading}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={() => {
        clearFilters();
        handleSearch();
      }}
      renderAutoComplete={renderAutoComplete}
      showSearchHelp={false}
    />
  );
}
