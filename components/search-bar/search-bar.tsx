import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerNoIcon as SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDebounceCallback } from 'usehooks-ts';
import useSingleStore from '@/stores/singleSearchStore';
import { Tcgs } from '@/types';


const suggestionQueryResults = [
  { name: 'Courageous' },
  { name: 'Counterbore' },
  { name: 'Counterspell' },
  { name: 'Counterflux' },
  { name: 'Countermand' },
];

interface AutocompleteResult {
  name: string;
}

type Props = {
  search(searchText: string): void;
  autocompleteSearch(searchText: string): void; 
}





export default function SingleSearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tcgValue, setTcgValue] = useState('mtg');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;
  const {fetchCards, tcg, setTcg} = useSingleStore();
  const fetchAutoCompleteResults = useCallback(
    (value: string) => {
      const url = `${autoCompleteUrl}/cards?tcg=${
        tcgValue
      }&query=${encodeURIComponent(value)}`;
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
    [autoCompleteUrl, 'mtg']
  );
  const debouncedAutoCompleteResults = useDebounceCallback(fetchAutoCompleteResults, 500);


  useEffect(() => {
    if (inputValue.trim().length > 2) {
      debouncedAutoCompleteResults(inputValue);
    } else {
      setSuggestions([]);
      setIsAutoCompleteVisible(false);
      setSelectedIndex(-1);
    }
  }, [inputValue]);


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
    setInputValue(value);

    if (value.trim().length > 2) {
      debouncedAutoCompleteResults(value);
    } else {
      setSuggestions([]);
      setIsAutoCompleteVisible(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setInputValue(suggestion.name);
    setIsAutoCompleteVisible(false);
    handleSearch(); // Trigger search
  };

  const handleSearch = () => {
    console.log('Searching for:', inputValue);
    fetchCards(inputValue); 
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
            return nextIndex < totalResults ? nextIndex : prevIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prevIndex) => {
            const nextIndex = prevIndex - 1;
            return nextIndex >= 0 ? nextIndex : -1;
          });
          break;
        case 'Enter':
        case 'ArrowRight':
          if (selectedIndex >= 0 && selectedIndex < totalResults) {
            const item = suggestions[selectedIndex];
            if (item) {
              handleSuggestionClick(item);
              // search(item.name);
            }
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
    <div className="relative w-full max-w-3xl">
      <div className="flex w-full items-center rounded-full bg-popover p-1">
        <Select onOpenChange={setIsOpen}
          value={tcg}
          onValueChange={(value: Tcgs) => {
            setTcg(value);
            useSingleStore.setState({ results: [] });
            useSingleStore.setState({ searchStarted: false });
            useSingleStore.setState({ searchInput: '' });
          }
          }
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
            <SelectItem value="mtg">MTG</SelectItem>
            <SelectItem value="lorcana">Lorcana</SelectItem>
            <SelectItem value="onepiece">One Piece</SelectItem>
            <SelectItem value="pokemon">Pokemon</SelectItem>
            <SelectItem value="yugioh">Yu-Gi-Oh</SelectItem>
          </SelectContent>
        </Select>
        <div className="mx-2 h-8 w-px"></div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Game Name + #NA1"
          className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="mr-4 text-primary">
          <MagnifyingGlassIcon className='w-5 h-5' onClick={handleSearch} />
        </div>
      </div>
      {isAutoCompleteVisible && (
        <div
          ref={autoCompleteRef}
          className="absolute left-[200px] p-1 right-12 z-10 mt-1 rounded-md bg-popover shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded px-4 py-2  ${
                selectedIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
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
