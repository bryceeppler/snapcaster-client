// components/SearchBar.tsx

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTriggerNoIcon as SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDebounceCallback } from 'usehooks-ts';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';
interface AutocompleteResult {
  name: string;
}

export default function SingleSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;

  // Use the new store
  const {
    tcg,
    setTcg,
    searchTerm,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters
  } = useSingleSearchStore();

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

  // useEffect(() => {
  //   if (searchTerm.trim().length > 1) {
  //     debouncedAutoCompleteResults(searchTerm);
  //   } else {
  //     setSuggestions([]);
  //     setIsAutoCompleteVisible(false);
  //     setSelectedIndex(-1);
  //   }
  // }, [searchTerm]);

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

  const handleSearch = () => {
    clearFilters();
    clearSearchResults();
    fetchCards();
    trackSearch(searchTerm, tcg, 'single');
    setIsAutoCompleteVisible(false);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
    <div className="relative w-full max-w-2xl md:ml-5 md:mr-3">
      <div className="flex w-full items-center rounded-full border border-border bg-popover p-1">
        <Select
          //onOpenChange={setIsOpen}
          value={tcg}
          onValueChange={(value: Tcg) => {
            setTcg(value);
            setSearchTerm('');
            setSuggestions([]);
            setIsAutoCompleteVisible(false);
            setSelectedIndex(-1);
          }}
        >
          <SelectTrigger className="w-[180px] border-none bg-transparent p-2 pl-4 font-bold text-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="TCG" />
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </SelectTrigger>

          <SelectContent className="mt-1">
            <SelectGroup>
              <SelectItem value="mtg">MTG</SelectItem>
              <SelectItem value="lorcana">Lorcana</SelectItem>
              <SelectItem value="onepiece">One Piece</SelectItem>
              <SelectItem value="pokemon">Pokemon</SelectItem>
              <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="starwars">Star Wars</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="mx-2 h-8 w-px"></div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            window.innerWidth >= 768 ? 'Search for a card...' : 'Search...'
          }
          className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="mr-4 text-foreground">
          <MagnifyingGlassIcon
            className="h-5 w-5"
            onClick={() => {
              clearFilters();
              handleSearch();
            }}
          />
        </div>
      </div>
      {isAutoCompleteVisible && (
        <div
          ref={autoCompleteRef}
          className="absolute z-10 mt-1 w-full rounded-lg bg-popover p-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-lg px-4 py-2  ${
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
