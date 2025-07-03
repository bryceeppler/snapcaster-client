'use client';

import type { KeyboardEvent } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/router';

import type { DeviceType } from '../../../types/navbar';

import BaseSearchBar from '@/components/ui/base-search-bar';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { TCG_SELECT_TO_PATH } from '@/utils/tcgPathHelper';
import type { Tcg } from '@/types';
import { trackSearch } from '@/utils/analytics';

/**
 * Sealed search bar component that connects to the sealed search store
 */
export default function SealedSearchBar({
  deviceType
}: {
  deviceType: DeviceType;
}) {
  const router = useRouter();

  const {
    productCategory,
    searchTerm,
    setProductCategory,
    setSearchTerm,
    clearFilters,
    sortBy,
    selectedFilters,
    region
  } = useSealedSearchStore();

  const inputRef = useRef<HTMLInputElement>(null);

  // Get search loading and refetch from query hook
  const { isLoading, refetch } = useSealedSearch({
    productCategory,
    searchTerm,
    sortBy,
    selectedFilters,
    region
  });

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  // Handle key navigation
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  // Handle search button click
  const handleSearch = () => {
    clearFilters();
    refetch();
    trackSearch('sealed', searchTerm, productCategory);
  };

  // Handle TCG change (product category in sealed context)
  const handleTcgChange = (value: Tcg) => {
    setProductCategory(value);
    setSearchTerm('');

    // Navigate to the corresponding sealed page
    const pathValue = TCG_SELECT_TO_PATH[value];
    if (pathValue) {
      router.push(`/sealed/${pathValue}`);
    }
  };

  return (
    <BaseSearchBar
      deviceType={deviceType}
      tcg={productCategory}
      searchTerm={searchTerm}
      placeholder="Search for sealed product"
      isLoading={isLoading}
      inputRef={inputRef}
      onTcgChange={handleTcgChange}
      onInputChange={handleInputChange}
      onInputKeyDown={handleKeyDown}
      onSearchClick={handleSearch}
      showSearchHelp={false}
    />
  );
}
