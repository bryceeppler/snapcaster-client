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

const gameNames = [
  { name: 'League of Legends' },
  { name: 'Valorant' },
  { name: 'Counter-Strike: Global Offensive' },
  { name: 'Dota 2' },
  { name: 'Overwatch' },
  { name: 'Apex Legends' },
  { name: 'Call of Duty: Warzone' },
  { name: 'Fortnite' },
  { name: 'PUBG' },
  { name: 'Rainbow Six Siege' }
];

interface AutocompleteResult {
  name: string;
}

type Props = {
  suggestionsSearchFunction(searchText: string): void;
}

export default function Component(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filtered = gameNames.filter((result) =>
      result.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filtered);
    setIsAutoCompleteVisible(inputValue.length > 0 && filtered.length > 0);
    setSelectedIndex(-1);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: AutocompleteResult) => {
    setInputValue(suggestion.name);
    setIsAutoCompleteVisible(false);
    props.suggestionsSearchFunction(suggestion.name); // Trigger search
  };

  const handleSearch = () => {
    console.log('Searching for:', inputValue);
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
              props.suggestionsSearchFunction(item.name);
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
    [suggestions, selectedIndex, props]
  );

  return (
    <div className="relative">
      <div className="flex w-full max-w-3xl items-center rounded-full bg-gray-800 p-1">
        <Select onOpenChange={setIsOpen}>
          <SelectTrigger className="w-[180px] border-none bg-transparent p-2 text-gray-400 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="Region" />
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="na">North America</SelectItem>
            <SelectItem value="eu">Europe</SelectItem>
            <SelectItem value="as">Asia</SelectItem>
          </SelectContent>
        </Select>
        <div className="mx-2 h-8 w-px bg-gray-700"></div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Game Name + #NA1"
          className="flex-grow border-none bg-transparent text-gray-300 placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="mr-4 text-lg font-bold text-blue-400">.GG</div>
      </div>
      {isAutoCompleteVisible && (
        <div
          ref={autoCompleteRef}
          className="absolute left-[200px] right-12 z-10 mt-1 rounded-md bg-gray-800 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`mx-1 cursor-pointer rounded px-4 py-2  ${
                selectedIndex === index ? 'bg-primary' : 'hover:bg-accent'
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
