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
import React, { useState } from 'react';
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
import { SearchResultsHeader } from '../buylists/header/header';

const Navbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  const { isAuthenticated, isVendor, isAdmin } = useAuth();
  const canViewAnalytics = isAdmin || isVendor;
  const [mobileNavSheetOpen, setMobileNavSheetOpen] = useState(false);
  const [mobileSearchIsVisible, setMobileSearchIsVisible] = useState(false);

  return (
    <>
      {/* MOBILE NAV */}
      <div className="sticky top-0 z-50 md:hidden">
        <div className=" flex   justify-between bg-card px-1 shadow-xl">
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

          {/* Nav Search Bars (Sealed, Singles, Buylists)*/}
          {currentPath === '/sealed' && (
            <div className="w-full  bg-card ">
              <div className=" px-2 py-2">
                {NavSearchBarFactory('sealed', {
                  deviceType: 'mobile'
                })}
              </div>
            </div>
          )}
          {currentPath === '/' && (
            <div
              className={`fixed left-0 top-0 z-50 flex h-[48px] w-full items-center justify-between bg-background text-white shadow-lg transition-transform duration-500 md:px-2 ${
                mobileSearchIsVisible ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              {NavSearchBarFactory('singles', {
                deviceType: 'mobile',
                toggleMobileSearch: () =>
                  setMobileSearchIsVisible(!mobileSearchIsVisible)
              })}
            </div>
          )}
          {currentPath === '/buylists' && isAuthenticated && (
            <div
              className={`fixed left-0 top-0 z-50 flex h-[48px] w-full items-center justify-between bg-background text-white transition-transform duration-500 md:px-2 ${
                mobileSearchIsVisible ? 'translate-y-0' : '-translate-y-full'
              }`}
            >
              {NavSearchBarFactory('buylists', {
                deviceType: 'mobile',
                toggleMobileSearch: () =>
                  setMobileSearchIsVisible(!mobileSearchIsVisible)
              })}
            </div>
          )}
        </div>
        {/* ResultsToolbarFactory (Singles, Buylists) */}
        {currentPath === '/' && ResultsToolbarFactory('singles')}
        {currentPath === '/buylists' && ResultsToolbarFactory('buylists')}
      </div>

      {/* DESKTOP NAV MD+ */}
      <div className="sticky top-0 z-50 bg-card  shadow-md">
        <div className="hidden h-16 items-stretch justify-between px-6 py-4 md:flex">
          {/* 1. Left Section: Snapcaster Logo */}
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

          {/* 2. Middle Section: Nav Search Bar (Singles, Buylists, Sealed) */}
          <div className="flex flex-1 items-center justify-center">
            {currentPath === '/' &&
              NavSearchBarFactory('singles', { deviceType: 'desktop' })}
            {currentPath === '/buylists' &&
              isAuthenticated &&
              NavSearchBarFactory('buylists', { deviceType: 'desktop' })}
            {currentPath === '/sealed' &&
              NavSearchBarFactory('sealed', { deviceType: 'desktop' })}
          </div>

          {/* 3. Right Section: Theme Toggle, Account Button) */}
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

const SingleNavSearchBar = ({
  deviceType,
  toggleMobileSearch
}: NavSearchBarProps) => {
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
    <>
      <NavSearchBar
        deviceType={deviceType}
        toggleMobileSearch={toggleMobileSearch}
        searchTerm={searchTerm}
        tcg={tcg}
        clearFilters={clearFilters}
        setSearchTerm={setSearchTerm}
        setTcg={setTcg}
        fetchQuery={fetchCards}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </>
  );
};

const BuylistsNavSearchBar = ({
  deviceType,
  toggleMobileSearch
}: NavSearchBarProps) => {
  const { searchTerm, tcg, setSearchTerm, setTcg } = useBuyListStore();
  return (
    <>
      <BuylistNavSearchBar
        deviceType={deviceType}
        toggleMobileSearch={toggleMobileSearch}
        searchTerm={searchTerm}
        tcg={tcg}
        setSearchTerm={setSearchTerm}
        setTcg={setTcg}
      />
    </>
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
    <>
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
    </>
  );
};

///////////////////////////////////
// Mobile ResultsToolbar Factory //
///////////////////////////////////
/* The bar bewlow the nav for mobile single/buylist search which contains the reuslts, pagination, and filters on a query */
const ResultsToolbarFactory = (searchMode: NavSearchMode) => {
  // const { buylistUIState } = useBuyListStore();
  switch (searchMode) {
    case 'singles':
      return <SingleResultsToolbar />;
    case 'buylists':
      return <SearchResultsHeader isMobile={true} />;
    // return <BuylistsResultsToolbar />;
    // return <div>BuylistsResultsToolbar</div>;
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
// const BuylistsResultsToolbar = () => {
//   const {
//     searchResults,
//     numResults,
//     currentPage,
//     setCurrentPage,
//     numPages,
//     fetchCards,
//     setIsLoading,
//     filterOptions,
//     sortBy,
//     clearFilters,
//     setFilter,
//     applyFilters,
//     setSortBy,
//     sortByOptions
//   } = useBuyListStore();
//   return (
//     <>
//       {searchResults && (
//         <div className="z-50 flex h-12 items-center justify-between border-b bg-background px-4">
//           <span className="text-center text-sm font-normal text-secondary-foreground ">
//             {numResults} results
//           </span>
//           <SearchPagination
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             numPages={numPages}
//             fetchCards={fetchCards}
//             setIsLoading={setIsLoading}
//           />
//           <Sheet>
//             <SheetTitle className="hidden">Filters</SheetTitle>
//             <SheetDescription className="hidden">
//               Filter your search results
//             </SheetDescription>
//             <SheetTrigger>
//               <SlidersHorizontal className="h-6 w-6" />
//             </SheetTrigger>
//             <SheetContent className="min-w-full">
//               <FilterSection
//                 filterOptions={filterOptions}
//                 sortBy={sortBy}
//                 fetchCards={fetchCards}
//                 clearFilters={clearFilters}
//                 setFilter={setFilter}
//                 setCurrentPage={setCurrentPage}
//                 applyFilters={applyFilters}
//                 setSortBy={setSortBy}
//                 sortByOptions={sortByOptions}
//               />
//             </SheetContent>
//           </Sheet>
//         </div>
//       )}
//     </>
//   );
// };
export default Navbar;
