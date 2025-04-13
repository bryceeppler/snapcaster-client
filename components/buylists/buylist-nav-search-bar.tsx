//hooks and store states
import {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  useCallback,
  useMemo
} from 'react';
import useBuylistStore from '@/stores/useBuylistStore';
import { useBuylistSearch } from '@/hooks/queries/useBuylistSearch';
//components
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTriggerNoIcon as SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
//icons
import { ChevronDown, HelpCircle, X, Loader2 } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
//other
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';

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
  // Store
  const { filters, sortBy, clearFilters, buylistUIState, setBuylistUIState } =
    useBuylistStore();

  // State
  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constants
  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;
  const MIN_SEARCH_LENGTH = 3;
  const DEBOUNCE_MS = 300;

  // Queries
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
          clearFilters();
          refetch();
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
    [suggestions, selectedIndex, handleSuggestionClick, isTyping]
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

  const searchHelpContent = useMemo(
    () => (
      <div className="rounded-md">
        <div className="w-full">
          <div className="space-y-1 text-xs">
            <div>
              <h1 className="text-sm font-semibold">Search</h1>
              <p className="italic">
                Queries are based on the card base name only and should not be
                combined with set names, foiling, collector number, etc. Please
                use the filters to refine your search.
              </p>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Exact Search</h1>
              <p className="italic">
                Double quote your query if you want to do an exact search. For
                example:
                <span className="rounded px-1 py-0.5 font-mono">
                  "Mana Crypt"
                </span>
              </p>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Punctuation</h1>
              <p className="italic">
                Queries are not sensitive to capitalization or punctuation. For
                example:
                <span className="rounded px-1 py-0.5 font-mono">'",:.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  return (
    <div
      className={`relative w-full bg-transparent md:ml-4 md:mr-4 ${
        deviceType === 'desktop' ? 'max-w-2xl' : ''
      }`}
    >
      <div
        className={`flex h-min w-full items-center rounded ${
          deviceType === 'desktop' ? 'border border-border' : ''
        }`}
      >
        <Select
          value={tcg}
          onValueChange={(value: Tcg) => {
            clearFilters();
            setTcg(value);
            setSearchTerm('');
            setInputValue('');
            setSuggestions([]);
            setIsAutoCompleteVisible(false);
            setSelectedIndex(-1);
          }}
        >
          <SelectTrigger className="w-[180px] border-none bg-transparent p-2 pl-4 font-bold text-foreground focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="TCG" />
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="mtg">MTG</SelectItem>
              <SelectItem value="lorcana">Lorcana</SelectItem>
              <SelectItem value="onepiece">One Piece</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="starwars">Star Wars</SelectItem>
              <SelectItem value="fleshandblood">Flesh and Blood</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a card"
          className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        <div className="mr-1 text-foreground">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <MagnifyingGlassIcon
              className="h-6 w-6 cursor-pointer hover:text-muted-foreground"
              onClick={() => {
                clearFilters();
                refetch();
                if (
                  buylistUIState === 'viewAllOffersState' ||
                  buylistUIState === 'finalSubmissionState'
                ) {
                  setBuylistUIState('searchResultsState');
                }
              }}
            />
          )}
        </div>

        <div>
          <Popover>
            <PopoverTrigger asChild className="mr-1">
              <HelpCircle className="text-popover-foreground hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="p-2">{searchHelpContent}</PopoverContent>
          </Popover>
        </div>

        {deviceType === 'mobile' && (
          <div className="mr-2 text-foreground">
            <X
              className="h-6 hover:cursor-pointer"
              onClick={toggleMobileSearch}
            />
          </div>
        )}
      </div>

      {isAutoCompleteVisible && suggestions.length > 0 && (
        <div
          ref={autoCompleteRef}
          className="absolute z-50 mt-1 w-full rounded-lg bg-popover p-1 text-foreground shadow-lg"
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
      )}
    </div>
  );
}
