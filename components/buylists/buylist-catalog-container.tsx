import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import BuylistRightSideBodyFactory from './buylist-factory/right-factory';
import useGlobalStore from '@/stores/globalStore';
import useBuyListStore, {
  IBuylistCart,
  LeftUIState
} from '@/stores/useBuylistStore';

import FilterSection from '../search-ui/search-filter-container';
import BuylistLeftSideBodyFactory from './buylist-factory/left-factory';

import { useConnectedVendors } from '@/hooks/useConnectedVendors';
import { useCartItems } from '@/hooks/useCartItems';
import {
  useBuylistSearch,
  TransformedSearchResponse
} from '@/hooks/queries/useBuylistSearch';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '../ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import CardImage from '../ui/card-image';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

import {
  MixerHorizontalIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import { ArrowLeftIcon, BadgeDollarSign, ExternalLink } from 'lucide-react';
import { BuylistHeader } from './header/header';

export default function BuylistCatalog() {
  const { leftUIState } = useBuyListStore();
  // const {
  //   searchTerm,
  //   tcg,
  //   filterOptions,
  //   filters,
  //   setFilter,
  //   reviewData,
  //   sortBy,
  //   setSortBy,
  //   sortByOptions,
  //   clearFilters,
  //   setLeftUIState,
  //   leftUIState
  // } = useBuyListStore();
  // const {
  //   data,
  //   isLoading,
  //   hasNextPage,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   refetch
  // } = useBuylistSearch(
  //   {
  //     tcg,
  //     searchTerm,
  //     filters: filters || [],
  //     sortBy
  //   },
  //   { enabled: false }
  // );

  // // Refetch Search Results: When the sortBy or selected filters change, refetch the search results
  // useEffect(() => {
  //   refetch();
  // }, [sortBy, filters]);

  // // Infinite Scroll Obsesrver: This useState is needed to reinitialize the observer when the UI state changes off the search results state
  // const [shouldReinitObserver, setShouldReinitObserver] = useState(false);
  // const loadMoreRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (
  //     leftUIState === 'leftCartListSelection' ||
  //     leftUIState === 'leftCartEditWithViewOffers'
  //   ) {
  //     setShouldReinitObserver(true);
  //   }
  // }, [leftUIState]);

  // // Infinite Scroll Observer: Fetch more results when the user scrolls to the bottom of the page
  // useEffect(() => {
  //   if (
  //     (shouldReinitObserver || data?.searchResults) &&
  //     loadMoreRef.current &&
  //     hasNextPage
  //   ) {
  //     setShouldReinitObserver(false);
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  //           fetchNextPage();
  //         }
  //       },
  //       { threshold: 0.1 }
  //     );
  //     observer.observe(loadMoreRef.current);
  //     return () => {
  //       if (loadMoreRef.current) {
  //         observer.unobserve(loadMoreRef.current);
  //       }
  //     };
  //   }
  // }, [
  //   shouldReinitObserver,
  //   data?.searchResults,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage
  // ]);

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <BuylistHeader></BuylistHeader>

      {/* Body */}
      <div className=" flex gap-1">
        {/* Body - Left Sidebar */}
        <div className="">
          <BuylistLeftSideBodyFactory leftUIState={leftUIState} />
        </div>

        {/* Body - Content */}
        <div className="h-[75vh] w-full overflow-hidden rounded-lg border bg-card p-0.5">
          <ScrollArea className="h-full" type="scroll">
            <BuylistRightSideBodyFactory leftUIState={leftUIState} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
