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
};
export default function SearchBar({
  productCategory,
  searchTerm,
  setProductCategory,
  setSearchTerm,
  clearFilters,
  handleInputChange,
  handleSearch,
  isLoading
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
    <div className="relative w-full max-w-2xl md:ml-5 md:mr-3">
      <div className="flex w-full items-center rounded-full border border-border bg-popover p-1">
        <Select
          //onOpenChange={setIsOpen}
          value={productCategory}
          onValueChange={(value: ProductCategory) => {
            setProductCategory(value);
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
              <SelectItem value="sealed_mtg">MTG</SelectItem>
              <SelectItem value="sealed_lorcana">Lorcana</SelectItem>
              <SelectItem value="sealed_onepiece">One Piece</SelectItem>
              <SelectItem value="sealed_pokemon">Pokemon</SelectItem>
              <SelectItem value="sealed_yugioh">Yu-Gi-Oh</SelectItem>
              <SelectItem value="sealed_starwars">Star Wars</SelectItem>
              <SelectItem value="sealed_fleshandblood">
                Flesh and Blood
              </SelectItem>
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
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MagnifyingGlassIcon
              className="h-5 w-5"
              onClick={() => {
                clearFilters();
              handleSearch();
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
}
