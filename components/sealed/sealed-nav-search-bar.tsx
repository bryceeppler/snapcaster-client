import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';
import { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';
import BaseSearchBar, { DeviceType } from '../ui/base-search-bar';

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

  const handleTcgChange = (value: Tcg) => {
    setProductCategory(value);
    setSearchTerm('');
    setSuggestions([]);
    setIsAutoCompleteVisible(false);
    setSelectedIndex(-1);
  };

  return (
    <BaseSearchBar
      deviceType={deviceType as DeviceType}
      tcg={productCategory}
      searchTerm={searchTerm}
      placeholder="Search for sealed product"
      isLoading={isLoading}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={() => {
        clearFilters();
        handleSearch();
      }}
      showSearchHelp={false}
    />
  );
}
