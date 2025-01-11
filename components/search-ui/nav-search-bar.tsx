import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
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
import { ChevronDown, HelpCircle, X } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';
interface AutocompleteResult {
  name: string;
}
type Props = {
  type: string;
  toggleMobileSearch?: () => void;
  fetchQuery: () => void;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setTcg: (tcg: Tcg) => void;
  tcg: Tcg;
  clearFilters: () => void;
};
export default function NavSearchBar({
  type,
  toggleMobileSearch,
  fetchQuery,
  setSearchTerm,
  searchTerm,
  setTcg,
  tcg,
  clearFilters
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
    100
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

  const handleSearch = useCallback(() => {
    clearFilters();
    fetchQuery();
    trackSearch(searchTerm, tcg, 'single');
    setIsAutoCompleteVisible(false);
  }, [fetchQuery, searchTerm, tcg]);

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
    [suggestions, selectedIndex]
  );

  return (
    <div
      className={`relative w-full  bg-transparent md:ml-4 md:mr-4 ${
        type == 'desktop' ? 'max-w-2xl' : ''
      }`}
    >
      <div
        className={`flex h-min w-full items-center rounded ${
          type == 'desktop' ? 'border border-border' : ''
        }`}
      >
        <Select
          value={tcg}
          onValueChange={(value: Tcg) => {
            setTcg(value);
            setSearchTerm('');
            setSuggestions([]);
            setIsAutoCompleteVisible(false);
            setSelectedIndex(-1);
          }}
        >
          <SelectTrigger className="w-[180px] border-none bg-transparent p-2 pl-4 font-bold text-foreground focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="TCG" />
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 " />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="mtg">MTG</SelectItem>
              <SelectItem value="lorcana">Lorcana</SelectItem>
              <SelectItem value="onepiece">One Piece</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a card"
          className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="mr-1 text-foreground">
          <MagnifyingGlassIcon
            className="h-6 w-6 hover:cursor-pointer"
            onClick={() => {
              clearFilters();
              handleSearch();
            }}
          />
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild className="mr-1">
              <HelpCircle className="text-popover-foreground hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="rounded-md shadow-md">
                <div className="w-full">
                  <div className="space-y-1 text-xs">
                    <div>
                      <h1 className="text-sm font-semibold">Search</h1>
                      <p className="italic">
                        Queries are based on the card base name only and should
                        not be combined with set names, foiling, collector
                        number, etc. Please use the filters to refine your
                        search.
                      </p>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">Exact Search</h1>
                      <p className="italic">
                        Double quote your query if you want to do an exact
                        search. For example:
                        <span className="rounded px-1 py-0.5 font-mono">
                          "Mana Crypt"
                        </span>
                      </p>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">Punctuation</h1>
                      <p className="italic">
                        Queries are not sensitive to capitalization or
                        punctuation. For example:
                        <span className="rounded px-1 py-0.5 font-mono">
                          '",:.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {type == 'mobile' ? (
          <div className="mr-2 text-foreground">
            <X
              className="h-6  hover:cursor-pointer"
              onClick={toggleMobileSearch}
            />
          </div>
        ) : null}
      </div>
      {isAutoCompleteVisible && (
        <div
          ref={autoCompleteRef}
          className="absolute z-20 mt-1 w-full rounded-lg bg-popover p-1 text-foreground shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`cursor-pointer px-4 py-2  ${
                selectedIndex === index
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              } `}
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
