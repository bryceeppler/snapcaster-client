'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { useAuth } from '@/hooks/useAuth';
import {
  AlignJustify,
  SlidersHorizontal,
  ShoppingCart,
  ChevronDown,
  User,
  Settings,
  Palette,
  Plug2,
  CreditCard,
  LayoutDashboard,
  Users,
  Tag,
  Store,
  ShoppingBag,
  BarChart4,
  Tags,
  Shield
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import ModeToggle from '../theme-toggle';
import NavSearchBar from '../search-ui/nav-search-bar';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import SealedSearchBar from '../sealed/sealed-nav-search-bar';
import BuylistNavSearchBar from '../buylists/buylist-nav-search-bar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import FilterSection from '../search-ui/search-filter-container';
import SearchPagination from '../search-ui/search-pagination';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import useBuyListStore from '@/stores/useBuylistStore';
import { Badge } from './badge';
import { useUserCarts } from '@/hooks/useUserCarts';
import { cn } from '@/lib/utils';
import MobileNav from '@/components/mobile-nav';
// Custom navigation link component
interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

const NavLink = ({
  href,
  isActive,
  children,
  target,
  rel,
  onClick
}: NavLinkProps) => (
  <Link
    href={href}
    className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary 
      ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
    target={target}
    rel={rel}
    onClick={onClick}
  >
    {children}
    {isActive && (
      <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-t-full bg-primary"></span>
    )}
  </Link>
);

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { isAuthenticated, isVendor, isAdmin } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);
  const { buylistUIState } = useBuyListStore();
  const { openCart: cartSheetOpen, setOpenCart: setCartSheetOpen } =
    useBuyListStore();
  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  // State for accordion sections
  const [accountExpanded, setAccountExpanded] = useState<boolean>(false);
  const [analyticsExpanded, setAnalyticsExpanded] = useState<boolean>(false);

  // Get cart data
  const { getCurrentCart } = useUserCarts();
  const currentCart = getCurrentCart();
  const hasItems =
    currentCart?.cart?.items && currentCart.cart.items.length > 0;
  const cartItemCount = hasItems ? currentCart.cart.items.length : 0;

  // Auto-expand sections based on current path
  useEffect(() => {
    if (currentPath.startsWith('/account')) {
      setAccountExpanded(true);
    } else if (currentPath.startsWith('/vendors')) {
      setAnalyticsExpanded(true);
    }
  }, [currentPath]);

  // Handle cart button click
  const handleCartClick = () => {
    // Toggle cart sheet
    setCartSheetOpen(!cartSheetOpen);
  };

  return (
    <>
      {/* MOBILE NAV */}
      <MobileNav />

      {/* DESKTOP NAV MD+ */}
      <div className="sticky top-0 z-40 hidden lg:block">
        {/* Top section with logo, search and account */}
        <div className="border-b border-border/40 bg-card">
          <div className="flex h-16 items-center justify-between px-6">
            {/* 1. Left Section: Snapcaster Logo */}
            <div className="flex items-center">
              <Link href="/" passHref>
                <div className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90">
                  <img
                    className="h-6 w-auto"
                    src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                    alt="Snapcaster"
                  />
                  <p className="font-genos text-2xl font-bold leading-none tracking-tighter">
                    Snapcaster
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. Middle Section: Nav Search Bar (Singles, Buylists, Sealed) */}
            <div className="mx-8 flex max-w-2xl flex-1 items-center justify-center">
              {currentPath === '/' &&
                NavSearchBarFactory('singles', { deviceType: 'desktop' })}
              {currentPath === '/buylists' &&
                NavSearchBarFactory('buylists', { deviceType: 'desktop' })}
              {currentPath === '/sealed' &&
                NavSearchBarFactory('sealed', { deviceType: 'desktop' })}
            </div>

            {/* 3. Right Section: Theme Toggle, Account Button */}
            <div className="flex items-center gap-3">
              <ModeToggle />

              <Link href={isAuthenticated ? `/account` : '/signin'}>
                <Button
                  variant={isAuthenticated ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'px-4 py-2 text-sm font-medium',
                    isAuthenticated && 'bg-primary text-primary-foreground'
                  )}
                >
                  {isAuthenticated ? (
                    <span>Account</span>
                  ) : (
                    <span>Sign In</span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Nav Links section */}
        <div className="border-b border-border/40 bg-card">
          <div className="px-6">
            <nav className="flex">
              <NavLink href="/" isActive={currentPath === '/'}>
                Home
              </NavLink>
              <NavLink
                href="/multisearch"
                isActive={currentPath === '/multisearch'}
              >
                Multi Search
              </NavLink>
              <NavLink href="/sealed" isActive={currentPath === '/sealed'}>
                Sealed Search
              </NavLink>
              <NavLink href="/buylists" isActive={currentPath === '/buylists'}>
                Buylists
              </NavLink>
              <NavLink href="/about" isActive={currentPath === '/about'}>
                About
              </NavLink>
              <NavLink
                href="https://discord.gg/EnKKHxSq75"
                isActive={false}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </NavLink>
              {canViewAnalytics && (
                <NavLink
                  href="/vendors/dashboard"
                  isActive={currentPath.startsWith('/vendors')}
                >
                  Analytics
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

////////////////////////////
// NAV SEARCH BAR FACTORY //
////////////////////////////
type NavSearchMode = 'singles' | 'sealed' | 'buylists';
type DeviceOptions = 'mobile' | 'desktop';
interface NavSearchBarProps {
  deviceType: DeviceOptions;
  toggleMobileSearch?: () => void;
}

export const NavSearchBarFactory = (
  searchMode: NavSearchMode,
  props: NavSearchBarProps
): JSX.Element | null => {
  switch (searchMode) {
    case 'singles':
      return <SingleNavSearchBar {...props} />;
    case 'buylists':
      return <BuylistsNavSearchBar {...props} />;
    case 'sealed':
      return <SealedNavSearchBar {...props} />;
    default:
      return null;
  }
};

const SingleNavSearchBar = ({ deviceType }: NavSearchBarProps) => {
  const {
    searchTerm,
    tcg,
    isLoading,
    fetchCards,
    setSearchTerm,
    setTcg,
    clearFilters,
    setIsLoading
  } = useSingleSearchStore();
  return (
    <NavSearchBar
      deviceType={deviceType}
      searchTerm={searchTerm}
      tcg={tcg}
      clearFilters={clearFilters}
      setSearchTerm={setSearchTerm}
      setTcg={setTcg}
      fetchQuery={fetchCards}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
    />
  );
};

const BuylistsNavSearchBar = ({ deviceType }: NavSearchBarProps) => {
  const { searchTerm, tcg, setSearchTerm, setTcg } = useBuyListStore();
  return (
    <BuylistNavSearchBar
      deviceType={deviceType}
      searchTerm={searchTerm}
      tcg={tcg}
      setSearchTerm={setSearchTerm}
      setTcg={setTcg}
    />
  );
};

const SealedNavSearchBar = ({ deviceType }: NavSearchBarProps) => {
  const {
    productCategory,
    searchTerm: sealedSearchTerm,
    setProductCategory,
    setSearchTerm: sealedSetSearchTerm,
    clearFilters: sealedClearFilters,
    sortBy: sealedSortBy,
    selectedFilters,
    region
  } = useSealedSearchStore();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    sealedSetSearchTerm(value);
  };
  const { isLoading: sealedSearchLoading, refetch } = useSealedSearch({
    productCategory,
    searchTerm: sealedSearchTerm,
    sortBy: sealedSortBy,
    selectedFilters,
    region
  });

  const handleSearch = () => {
    sealedSetSearchTerm(sealedSearchTerm.trim());
    refetch();
  };
  return (
    <SealedSearchBar
      deviceType={deviceType}
      productCategory={productCategory}
      searchTerm={sealedSearchTerm}
      setProductCategory={setProductCategory}
      setSearchTerm={sealedSetSearchTerm}
      handleInputChange={handleInputChange}
      handleSearch={handleSearch}
      clearFilters={sealedClearFilters}
      isLoading={sealedSearchLoading}
    />
  );
};

///////////////////////////////////
// Mobile ResultsToolbar Factory //
///////////////////////////////////
/* The bar bewlow the nav for mobile single/buylist search which contains the reuslts, pagination, and filters on a query */
export const ResultsToolbarFactory = (searchMode: NavSearchMode) => {
  switch (searchMode) {
    case 'singles':
      return <SingleResultsToolbar />;
    default:
      return null;
  }
};

const SingleResultsToolbar = () => {
  const {
    searchResults,
    numResults,
    currentPage,
    setCurrentPage,
    numPages,
    fetchCards,
    setIsLoading,
    filterOptions,
    sortBy,
    clearFilters,
    setFilter,
    applyFilters,
    setSortBy,
    sortByOptions
  } = useSingleSearchStore();
  return (
    <>
      {searchResults && (
        <div className="z-50 flex h-12 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
          <span className="text-center text-sm font-normal text-muted-foreground">
            {numResults} results
          </span>
          <SearchPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            numPages={numPages}
            fetchCards={fetchCards}
            setIsLoading={setIsLoading}
          />
          <Sheet>
            <SheetTitle className="hidden">Filters</SheetTitle>
            <SheetDescription className="hidden">
              Filter your search results
            </SheetDescription>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 rounded-full px-2.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="min-w-full">
              <FilterSection
                filterOptions={filterOptions}
                sortBy={sortBy}
                fetchCards={fetchCards}
                clearFilters={clearFilters}
                setFilter={setFilter}
                setCurrentPage={setCurrentPage}
                handleSortByChange={(value: any) => {
                  setSortBy(value);
                  setCurrentPage(1);
                  fetchCards();
                }}
                applyFilters={applyFilters}
                setSortBy={setSortBy}
                sortByOptions={sortByOptions}
              />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};

export default Navbar;
