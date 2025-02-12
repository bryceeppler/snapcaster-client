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
import { Loader2 } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg, ProductCategory } from '@/types';
import { trackSearch } from '@/utils/analytics';
import { X } from 'lucide-react';

interface AutocompleteResult {
  name: string;
}
type Props = {
  productCategory: ProductCategory;
  searchTerm: string;
  setProductCategory: (productCategory: ProductCategory) => void;
  setSearchTerm: (searchBoxValue: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  handleSearch: () => void;
  clearFilters: () => void;
  type?: 'mobile' | 'desktop';
};
export default function SearchBar({
  productCategory,
  searchTerm,
  setProductCategory,
  setSearchTerm,
  clearFilters,
  handleInputChange,
  handleSearch,
  isLoading,
  type = 'desktop'
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isAutoCompleteVisible, setIsAutoCompleteVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCompleteUrl = process.env.NEXT_PUBLIC_AUTOCOMPLETE_URL;

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const key = event.key;

      switch (key) {

        case 'Enter':
        case 'ArrowRight':
        
          clearFilters();
          handleSearch();
          break;

        default:
          break;
      }
    },
    [suggestions, selectedIndex]
  );

  return (
    <div className={`relative w-full ${type === 'desktop' ? 'max-w-2xl md:ml-4 md:mr-4' : ''}`}>
      <div className={`flex h-min w-full items-center rounded border border-border`}>
        <Select
          value={productCategory}
          onValueChange={(value: ProductCategory) => {
            setProductCategory(value);
            setSearchTerm('');
            setSuggestions([]);
            setIsAutoCompleteVisible(false);
            setSelectedIndex(-1);
          }}
        >
          <SelectTrigger className="w-fit max-w-[100px] sm:max-w-fit border-none bg-accent rounded-l-md rounded-r-none h-[42px] p-2 text-accent-foreground focus:ring-0 focus:ring-offset-0 text-xs">
            <SelectValue placeholder="TCG" />
            <ChevronDown className="ml-1 h-3 w-3 shrink-0 transition-transform duration-200" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="sealed_mtg">MTG</SelectItem>
              <SelectItem value="sealed_lorcana">Lorcana</SelectItem>
              <SelectItem value="sealed_onepiece">One Piece</SelectItem>
              <SelectItem value="sealed_pokemon">Pokemon</SelectItem>
              <SelectItem value="sealed_yugioh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="sealed_starwars">Star Wars</SelectItem>
              <SelectItem value="sealed_fleshandblood">Flesh and Blood</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex flex-1 items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search Snapcaster"
            className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => {
              clearFilters();
              handleSearch();
            }}
            className="flex h-[42px] w-12 items-center justify-center rounded-r-md bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
