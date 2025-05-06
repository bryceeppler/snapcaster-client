'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './button';
import { useAuth } from '@/hooks/useAuth';
import { AlignJustify, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import React, { useState, useRef } from 'react';
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
import FilterSection from '../search-ui/search-filter-container';
import SearchPagination from '../search-ui/search-pagination';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import useBuyListStore from '@/stores/useBuylistStore';
import { Badge } from './badge';
import { useUserCarts } from '@/hooks/useUserCarts';
import { cn } from '@/lib/utils';

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

  // Get cart data
  const { getCurrentCart } = useUserCarts();
  const currentCart = getCurrentCart();
  const hasItems =
    currentCart?.cart?.items && currentCart.cart.items.length > 0;
  const cartItemCount = hasItems ? currentCart.cart.items.length : 0;

  // Handle cart button click
  const handleCartClick = () => {
    // Toggle cart sheet
    setCartSheetOpen(!cartSheetOpen);
  };

  return (
    <>
      {/* MOBILE NAV */}
      <div className="sticky top-0 z-50 lg:hidden">
        {/* Top Bar: Logo, Hamburger and Cart */}
        <div className="flex justify-between border-b border-border/40 bg-background/90 px-3 py-2.5 shadow-sm backdrop-blur-sm">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center">
            <Sheet
              open={mobileNavSheetOpen}
              onOpenChange={setMobileNavSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1 rounded-full hover:bg-accent"
                >
                  <AlignJustify className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={'left'} className="p-0">
                <SheetTitle hidden>Snapcaster</SheetTitle>
                <SheetDescription hidden>
                  Search Magic: The Gathering cards across Canada
                </SheetDescription>
                <SheetHeader className="border-b p-4">
                  <Link href="/" onClick={() => setMobileNavSheetOpen(false)}>
                    <div className="flex cursor-pointer items-center space-x-3">
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
                </SheetHeader>
                <div className="flex flex-col py-3">
                  <NavLink
                    href="/"
                    isActive={currentPath === '/'}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      Home
                    </Button>
                  </NavLink>
                  <NavLink
                    href="/multisearch"
                    isActive={currentPath === '/multisearch'}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      Multi Search
                    </Button>
                  </NavLink>
                  <NavLink
                    href="/sealed"
                    isActive={currentPath === '/sealed'}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      Sealed Search
                    </Button>
                  </NavLink>
                  <NavLink
                    href="/buylists"
                    isActive={currentPath === '/buylists'}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      Buylists
                    </Button>
                  </NavLink>
                  <NavLink
                    href="/about"
                    isActive={currentPath === '/about'}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      About
                    </Button>
                  </NavLink>
                  <NavLink
                    href="https://discord.gg/EnKKHxSq75"
                    isActive={false}
                    onClick={() => setMobileNavSheetOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-none pl-6 text-left"
                    >
                      Discord
                    </Button>
                  </NavLink>
                  {canViewAnalytics && (
                    <NavLink
                      href="/vendors/dashboard"
                      isActive={currentPath.startsWith('/vendors')}
                      onClick={() => setMobileNavSheetOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start rounded-none pl-6 text-left"
                      >
                        Analytics
                      </Button>
                    </NavLink>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between border-t p-4">
                  <Link href={isAuthenticated ? `/account` : '/signin'}>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setMobileNavSheetOpen(false)}
                    >
                      {isAuthenticated ? 'Account' : 'Sign In'}
                    </Button>
                  </Link>
                  <ModeToggle />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Middle: Logo */}
          <div className="absolute left-1/2 top-1/2 flex flex-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <Link href="/" passHref>
              <div className="flex cursor-pointer items-center space-x-2">
                <img
                  className="h-5 w-auto"
                  src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                  alt="Snapcaster"
                />
                <p className="font-genos text-xl font-bold leading-none tracking-tighter">
                  Snapcaster
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Cart Icon (for buylists) */}
          <div className="flex items-center">
            {currentPath === '/buylists' &&
              buylistUIState !== 'finalSubmissionState' && (
                <div className="relative">
                  {cartItemCount > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]"
                      variant="destructive"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                  <Button
                    ref={cartTriggerRef}
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full hover:bg-accent"
                    onClick={handleCartClick}
                    disabled={!currentCart?.cart?.name}
                  >
                    <ShoppingCart className="size-[18px]" />
                  </Button>
                </div>
              )}
          </div>
        </div>

        {/* Search Bar: Always visible below main nav */}
        <div className="border-b border-border/40 bg-background/80 p-2.5">
          {currentPath === '/' &&
            NavSearchBarFactory('singles', { deviceType: 'mobile' })}
          {currentPath === '/buylists' &&
            NavSearchBarFactory('buylists', { deviceType: 'mobile' })}
          {currentPath === '/sealed' &&
            NavSearchBarFactory('sealed', { deviceType: 'mobile' })}
        </div>

        {/* Results Toolbar: Filter and pagination */}
        {currentPath === '/' && ResultsToolbarFactory('singles')}
        {currentPath === '/buylists' && ResultsToolbarFactory('buylists')}
      </div>

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

const NavSearchBarFactory = (
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
const ResultsToolbarFactory = (searchMode: NavSearchMode) => {
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
