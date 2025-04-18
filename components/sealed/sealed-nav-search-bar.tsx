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
import { ChevronDown, HelpCircle, X, Loader2 } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';

interface AutocompleteResult {
  name: string;
}
type Props = {
  productCategory: Tcg;
  searchTerm: string;
  setProductCategory: (productCategory: Tcg) => void;
  setSearchTerm: (searchBoxValue: string) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  handleSearch: () => void;
  clearFilters: () => void;
  deviceType?: string;
  toggleMobileSearch?: () => void;
};
export default function SealedSearchBar({
  productCategory,
  searchTerm,
  setProductCategory,
  setSearchTerm,
  clearFilters,
  handleInputChange,
  handleSearch,
  isLoading,
  deviceType = 'desktop',
  toggleMobileSearch
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
    [clearFilters, handleSearch]
  );

  return (
    <div
      className={`relative w-full bg-transparent md:ml-4 md:mr-4 ${
        deviceType == 'desktop' ? 'max-w-2xl' : ''
      }`}
    >
      <div
        className={`flex h-min w-full items-center rounded ${
          deviceType == 'desktop' ? 'border border-border' : ''
        }`}
      >
        <Select
          value={productCategory}
          onValueChange={(value: Tcg) => {
            setProductCategory(value);
            setSearchTerm('');
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
          placeholder="Search for sealed product"
          className="flex-grow border-none bg-transparent text-foreground placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
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
                handleSearch();
              }}
            />
          )}
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild className="mr-1">
              <HelpCircle className="text-popover-foreground hover:cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="rounded-md">
                <div className="w-full">
                  <div className="space-y-1 text-xs">
                    <div>
                      <h1 className="text-sm font-semibold">Search</h1>
                      <p className="italic">
                        Queries are based on the product name only. Please use
                        the filters to refine your search.
                      </p>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">Exact Search</h1>
                      <p className="italic">
                        Double quote your query if you want to do an exact
                        search. For example:
                        <span className="rounded px-1 py-0.5 font-mono">
                          "Modern Horizons 2"
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

        {deviceType == 'mobile' ? (
          <div className="mr-2 text-foreground">
            <X
              className="h-6 hover:cursor-pointer"
              onClick={toggleMobileSearch}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
