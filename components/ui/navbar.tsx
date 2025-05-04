import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
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

const Navbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { isAuthenticated, isVendor, isAdmin } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);
  const { openCart: cartSheetOpen, setOpenCart: setCartSheetOpen } =
    useBuyListStore();
  const cartTriggerRef = useRef<HTMLButtonElement>(null);

  // Get cart data
  const { getCurrentCart } = useUserCarts();
  const currentCart = getCurrentCart();
  const hasItems =
    currentCart?.cart?.items && currentCart.cart.items.length > 0;
  const cartItemCount = hasItems ? currentCart.cart.items.length : 0;

  // Connect to buylist store
  const { setBuylistUIState } = useBuyListStore();

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
        <div className="flex justify-between bg-card px-1 shadow-sm">
          {/* Left: Hamburger Menu */}
          <div className="inset-y-0 left-0 flex items-center">
            <Sheet
              open={mobileNavSheetOpen}
              onOpenChange={setMobileNavSheetOpen}
            >
              <SheetTrigger className="m-1 inline-flex items-center justify-center p-2">
                <AlignJustify className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side={'left'} className="text-lg">
                <SheetTitle hidden>Snapcaster</SheetTitle>
                <SheetDescription hidden>Mobile Nav</SheetDescription>
                <SheetHeader>
                  <div className="flex flex-col gap-3 pb-3 pt-2">
                    <Link href="/" as="/">
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg "
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        Home
                      </Button>
                    </Link>
                    <Link href="/multisearch" as="/multisearch">
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg"
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        Multi Search
                      </Button>
                    </Link>
                    <Link href="/sealed" as="/sealed">
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg"
                      >
                        Sealed Search
                      </Button>
                    </Link>
                    <Link href="/buylists" as="/buylists">
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg"
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        Buylists
                      </Button>
                    </Link>
                    <Link href="/about" as="/about">
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg"
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        About
                      </Button>
                    </Link>
                    <Link
                      href="https://discord.gg/EnKKHxSq75"
                      as="https://discord.gg/EnKKHxSq75"
                    >
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg"
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        Discord
                      </Button>
                    </Link>

                    {canViewAnalytics && (
                      <Link href="/vendors/dashboard" as="/vendors/dashboard">
                        <Button
                          variant="ghost"
                          className="block w-full text-left text-lg"
                          onClick={() => {
                            setMobileNavSheetOpen(false);
                          }}
                        >
                          Analytics
                        </Button>
                      </Link>
                    )}

                    <Link href={isAuthenticated ? `/profile` : '/signin'}>
                      <Button
                        variant="ghost"
                        className="block w-full text-left text-lg "
                        onClick={() => {
                          setMobileNavSheetOpen(false);
                        }}
                      >
                        {isAuthenticated ? (
                          <span> Account</span>
                        ) : (
                          <span> Login</span>
                        )}
                      </Button>
                    </Link>
                    <ModeToggle />
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>

          {/* Middle: Logo */}
          <div className="flex flex-1 items-center">
            <Link legacyBehavior href="/" passHref>
              <div className="flex cursor-pointer items-center space-x-1">
                <p className="font-genos text-2xl font-bold leading-none tracking-tighter">
                  Snapcaster
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Cart Icon (for buylists) */}
          <div className="flex items-center">
            {currentPath === '/buylists' && (
              <div className="relative mr-1">
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-4 w-4 items-center justify-center px-1 text-[10px]">
                    {cartItemCount}
                  </Badge>
                )}
                <Button
                  ref={cartTriggerRef}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleCartClick}
                  disabled={!currentCart?.cart?.name}
                >
                  <ShoppingCart className="size-5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar: Always visible below main nav */}
        <div className="border-b bg-card p-2">
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
      <div className="sticky top-0 z-40 border-b bg-card">
        <div className="hidden h-16 items-stretch justify-between px-6 py-4 lg:flex">
          {/* 1. Left Section: Snapcaster Logo */}
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" passHref>
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
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 2. Middle Section: Nav Search Bar (Singles, Buylists, Sealed) */}
          <div className="flex max-w-2xl flex-1 items-center justify-center">
            {currentPath === '/' &&
              NavSearchBarFactory('singles', { deviceType: 'desktop' })}
            {currentPath === '/buylists' &&
              NavSearchBarFactory('buylists', { deviceType: 'desktop' })}
            {currentPath === '/sealed' &&
              NavSearchBarFactory('sealed', { deviceType: 'desktop' })}
          </div>

          {/* 3. Right Section: Theme Toggle, Account Button */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            <Link href={isAuthenticated ? `/profile` : '/signin'}>
              <Button className="px-4 py-2 text-sm font-medium">
                {isAuthenticated ? <span>Account</span> : <span>Sign In</span>}
              </Button>
            </Link>
          </div>
        </div>

        {/* 4. Nav Links (Home, Multi Search, Sealed Search, Buylists, About, Discord, Analytics) */}
        <div className="mx-3 hidden items-center justify-between lg:flex">
          <NavigationMenu className="my-1">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link legacyBehavior href="/" passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath == '/' &&
                      'rounded-b-none border-b-2 border-primary'
                    }`}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link legacyBehavior href="/multisearch" passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath == '/multisearch'
                        ? 'rounded-b-none border-b-2 border-primary'
                        : ''
                    }`}
                  >
                    Multi Search
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link legacyBehavior href="/sealed" passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath == '/sealed'
                        ? 'rounded-b-none border-b-2 border-primary'
                        : ''
                    }`}
                  >
                    Sealed Search
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link legacyBehavior href="/buylists" passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath == '/buylists' &&
                      'rounded-b-none border-b-2 border-primary'
                    }`}
                  >
                    Buylists
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link legacyBehavior href="/about" passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      currentPath == '/about'
                        ? 'rounded-b-none border-b-2 border-primary'
                        : ''
                    }`}
                  >
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  legacyBehavior
                  href="https://discord.gg/EnKKHxSq75"
                  passHref
                >
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    target="_blank"
                    rel="noopener noreferrer" // Recommended for security
                  >
                    Discord
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {canViewAnalytics && (
                <NavigationMenuItem
                  className={`${navigationMenuTriggerStyle()} ${
                    currentPath.startsWith('/vendors') &&
                    'rounded-b-none border-b-2 border-primary'
                  }`}
                >
                  <Link legacyBehavior href="/vendors/dashboard" passHref>
                    Analytics
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
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

// Add BuylistResultsToolbar component for mobile
const BuylistResultsToolbar = () => {
  const {
    searchResultCount,
    filterOptions,
    sortBy,
    setSortBy,
    setFilter,
    clearFilters,
    sortByOptions
  } = useBuyListStore();

  return (
    <>
      <div className="z-40 flex h-12 items-center justify-between border-b bg-background px-4">
        <span className="text-center text-sm font-normal text-secondary-foreground">
          {searchResultCount} results
        </span>

        <Sheet>
          <SheetTrigger>
            <SlidersHorizontal className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="min-w-full">
            <FilterSection
              filterOptions={filterOptions}
              sortBy={sortBy}
              fetchCards={async () => {}}
              clearFilters={clearFilters}
              setFilter={setFilter}
              setCurrentPage={() => {}}
              applyFilters={async () => {}}
              setSortBy={setSortBy}
              handleSortByChange={(value: any) => {
                setSortBy(value);
              }}
              sortByOptions={sortByOptions}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
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
        <div className="z-50 flex h-12 items-center justify-between border-b bg-background px-4">
          <span className="text-center text-sm font-normal text-secondary-foreground">
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
            <SheetTrigger>
              <SlidersHorizontal className="h-6 w-6" />
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
