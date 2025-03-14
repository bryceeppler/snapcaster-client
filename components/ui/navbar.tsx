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
import { AlignJustify, Search, SlidersHorizontal, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ModeToggle from '../theme-toggle';
import NavSearchBar from '../search-ui/nav-search-bar';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import SearchBar from '../sealed/search-bar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Tcg } from '@/types';
import FilterSection from '../search-ui/search-filter-container';
import SearchPagination from '../search-ui/search-pagination';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import globalStore from '@/stores/globalStore';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import useBuyListStore from '@/stores/buyListStore';

const Navbar: React.FC = () => {
  const { isAuthenticated, isVendor, isAdmin } = useAuth();
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);

  const canViewAnalytics = isAdmin || isVendor;

  const {
    initNotificationStatus,
    setNotificationStatusFalse,
    notificationStatus
  } = globalStore();

  useEffect(() => {
    initNotificationStatus();
  }, []);

  const router = useRouter();
  const currentPath = router.pathname;

  // Dynamically assign zustand states for the following components (single, buylists, sealed) => FilterSection, NavSearchBar, SearchPagination

  const singleSearchStore = useSingleSearchStore(); // Unconditionally called
  const buylistStore = useBuyListStore();
  const [mobileSearchIsVisible, setMobileSearchIsVisible] = useState(false);
  // Dynamically choose the store based on currentPath

  const queryStore =
    currentPath === '/buylists' ? buylistStore : singleSearchStore;

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

  const { isLoading: sealedSearchLoading, refetch } = useSealedSearch(
    {
      productCategory,
      searchTerm: sealedSearchTerm,
      sortBy: sealedSortBy,
      selectedFilters,
      region
    },
    {
      enabled: currentPath === '/sealed'
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    sealedSetSearchTerm(value);
  };

  const handleSearch = () => {
    sealedSetSearchTerm(sealedSearchTerm.trim());
    refetch();
  };

  // Destructure variables from queryStore or set defaults
  const {
    searchTerm,
    tcg,
    searchResults,
    currentPage,
    numPages,
    filterOptions,
    numResults,
    sortBy,
    setSortBy,
    fetchCards,
    applyFilters,
    setSearchTerm,
    setTcg,
    clearFilters,
    setCurrentPage,
    setFilter,
    isLoading,
    setIsLoading
  } = queryStore || {
    tcg: 'mtg' as Tcg,
    searchResults: [],
    searchTerm: '',
    numPages: null,
    filterOptions: [],
    numResults: null,
    sortBy: '',
    currentPage: 1,
    clearFilters: () => {},
    setCurrentPage: () => {},
    setFilter: () => {},
    setSearchTerm: () => {},
    setTcg: () => {},
    setSortBy: () => {},
    fetchCards: async () => {},
    applyFilters: async () => {},
    isLoading: false,
    setIsLoading: () => {}
  };

  return (
    <>
      {/* MOBILE NAV */}
      <div className="sticky top-0 z-50 md:hidden">
        <div className=" flex h-[60px]  justify-between bg-card px-1 shadow-xl">
          <div className=" inset-y-0 left-0 flex items-center">
            <Sheet
              open={mobileNavSheetOpen}
              onOpenChange={setMobileNavSheetOpen}
            >
              <SheetTitle className="hidden">Snapcaster</SheetTitle>
              <SheetTrigger className="m-1 inline-flex items-center justify-center p-2">
                <AlignJustify className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side={'left'} className="text-lg">
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
          <div className="flex flex-1 items-center justify-between">
            {/* Left Section */}
            <div className="flex flex-shrink-0 items-center">
              <Link legacyBehavior href="/" passHref>
                <div className="flex cursor-pointer items-center space-x-1">
                  <p className="pr-4 font-genos text-2xl font-bold leading-none tracking-tighter">
                    Snapcaster
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Section */}
            <div className="mx-2 flex items-center ">
              {(currentPath === '/' || currentPath === '/buylists') && (
                <button
                  onClick={() => {
                    setMobileSearchIsVisible(!mobileSearchIsVisible);
                  }}
                >
                  <Search className="mr-2" />
                </button>
              )}
              <Link href={isAuthenticated ? `/profile` : '/signin'}>
                <User />
              </Link>
            </div>
          </div>
          {currentPath === '/' && (
            <div
              className={`fixed left-0 top-0 z-50 flex h-[60px] w-full items-center justify-between bg-background text-white shadow-lg transition-transform duration-500 md:px-2 ${
                mobileSearchIsVisible ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <NavSearchBar
                type={'mobile'}
                toggleMobileSearch={() => {
                  setMobileSearchIsVisible(!mobileSearchIsVisible);
                }}
                searchTerm={searchTerm}
                tcg={tcg}
                clearFilters={clearFilters}
                setSearchTerm={setSearchTerm}
                setTcg={setTcg}
                fetchQuery={fetchCards}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
          {currentPath === '/buylists' && isAuthenticated && (
            <div
              className={`fixed left-0 top-0 z-50 flex h-[60px] w-full items-center justify-between bg-background text-white shadow-lg transition-transform duration-500 md:px-2 ${
                mobileSearchIsVisible ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              <NavSearchBar
                type={'mobile'}
                toggleMobileSearch={() => {
                  setMobileSearchIsVisible(!mobileSearchIsVisible);
                }}
                searchTerm={searchTerm}
                tcg={tcg}
                clearFilters={clearFilters}
                setSearchTerm={setSearchTerm}
                setTcg={setTcg}
                fetchQuery={fetchCards}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </div>
        {currentPath === '/sealed' && (
          <div className="w-full  bg-card ">
            <div className="border-t px-2 py-2">
              <SearchBar
                type="mobile"
                productCategory={productCategory}
                searchTerm={sealedSearchTerm}
                setProductCategory={setProductCategory}
                setSearchTerm={sealedSetSearchTerm}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                clearFilters={sealedClearFilters}
                isLoading={sealedSearchLoading}
              />
            </div>
          </div>
        )}
        <div className="mx-5 h-[0.5px] w-[calc(100%-40px)] "></div>{' '}
        {searchResults &&
          (currentPath == '/' || currentPath == '/buylists') && (
            <div className="z-50 flex h-12 items-center justify-between border-b bg-background px-4">
              <span className="text-center text-sm font-normal text-secondary-foreground ">
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
                    applyFilters={applyFilters}
                    setSortBy={setSortBy}
                  />
                </SheetContent>
              </Sheet>
            </div>
          )}
      </div>

      {/* DESKTOP NAV MD+ */}
      <div className="sticky top-0 z-50 bg-card  shadow-md">
        <div className="hidden h-16 items-stretch justify-between px-6 py-4 md:flex">
          {/* Left Section */}
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link legacyBehavior href="/" passHref>
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

          {/* Center Section */}
          <div className="flex flex-1 items-center justify-center">
            {currentPath === '/' && (
              <NavSearchBar
                type={'desktop'}
                searchTerm={searchTerm}
                tcg={tcg}
                fetchQuery={fetchCards}
                setSearchTerm={setSearchTerm}
                setTcg={setTcg}
                clearFilters={clearFilters}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {currentPath === '/buylists' && isAuthenticated && (
              <NavSearchBar
                type={'desktop'}
                searchTerm={searchTerm}
                tcg={tcg}
                fetchQuery={fetchCards}
                setSearchTerm={setSearchTerm}
                setTcg={setTcg}
                clearFilters={clearFilters}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            {currentPath === '/sealed' && (
              <SearchBar
                productCategory={productCategory}
                searchTerm={sealedSearchTerm}
                setProductCategory={setProductCategory}
                setSearchTerm={sealedSetSearchTerm}
                handleInputChange={handleInputChange}
                handleSearch={handleSearch}
                clearFilters={sealedClearFilters}
                isLoading={sealedSearchLoading}
              />
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href={isAuthenticated ? `/profile` : '/signin'}>
              <Button className="px-4 py-2 text-sm font-medium">
                {isAuthenticated ? <span>Account</span> : <span>Sign In</span>}
              </Button>
            </Link>
          </div>
        </div>

        <div className=" mx-3 hidden items-center justify-between md:flex">
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
      {/* {notificationStatus == true && (
        <div className="flex w-full items-center bg-primary px-1 text-secondary">
          <p className="flex-1 text-center text-xs font-medium md:text-base">
            Snapcaster now supports Star Wars: Unlimited! Try it out now!
          </p>
          <button onClick={setNotificationStatusFalse}>
            <X />
          </button>
        </div>
      )} */}
    </>
  );
};
export default Navbar;
