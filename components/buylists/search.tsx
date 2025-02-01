import useBuyListStore from '@/stores/buyListStore';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';
import NavSearchBar from '../search-ui/nav-search-bar';
import SearchPagination from '../search-ui/search-pagination';
import { Button } from '../ui/button';
import { ShoppingCartIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import BuylistFilterSection from './buylist-filter-section';
import BuylistCartSheet from './buylist-cart-sheet';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosWrapper';
import { IBuylistCart, IBuylistCartItem } from '@/stores/buyListStore';
import { SlidersHorizontal } from 'lucide-react';

const CART_KEY = (cartId: number) => ['cart', cartId] as const;

type Props = {
  setCurrentStep: (step: number) => void;
};

export default function Search({ setCurrentStep }: Props) {
  const {
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    searchResults,
    sortBy,
    filterOptions,
    fetchCards,
    setFilter,
    setSortBy,
    setCurrentPage,
    clearFilters,
    applyFilters,
    currentPage,
    currentCartId,
    numPages
  } = useBuyListStore();

  // Fetch cart data using React Query
  const { data: currentCart } = useQuery<{
    success: boolean;
    cart: IBuylistCart;
  } | null>({
    queryKey: CART_KEY(currentCartId || 0),
    queryFn: async () => {
      if (!currentCartId) return null;
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BUYLISTS_URL}/v2/carts/${currentCartId}`
      );
      return response.data;
    },
    enabled: !!currentCartId
  });

  // Calculate total items in cart
  const cartItemCount =
    currentCart?.cart?.items?.reduce(
      (total: number, item: IBuylistCartItem) => total + item.quantity,
      0
    ) || 0;

  const showPagination =
    searchResults && searchResults.length > 0 && numPages && numPages > 1;

  return (
    <>
      <div className="mb-6 sm:container">
        <div className="z-40  mb-1 rounded-lg border bg-popover px-4 py-2 md:sticky md:top-[113px]">
          <div className="flex flex-col items-center justify-center">
            <NavSearchBar
              type={'desktop'}
              searchTerm={searchTerm}
              tcg={tcg}
              fetchQuery={fetchCards}
              setSearchTerm={setSearchTerm}
              setTcg={setTcg}
              clearFilters={clearFilters}
            />
          </div>
          <div className="mx-auto flex flex-col items-center justify-center rounded-lg pt-2">
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <Sheet>
                <SheetTitle hidden>Filters</SheetTitle>
                <SheetDescription hidden>
                  Filter your search results
                </SheetDescription>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 text-sm font-medium"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <BuylistFilterSection
                    filterOptions={filterOptions}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    fetchCards={fetchCards}
                    clearFilters={clearFilters}
                    setFilter={setFilter}
                    setCurrentPage={setCurrentPage}
                    applyFilters={applyFilters}
                  />
                </SheetContent>
              </Sheet>
              {showPagination && (
                <div>
                  <SearchPagination
                    currentPage={currentPage}
                    numPages={numPages}
                    fetchCards={fetchCards}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
              <Sheet>
                <SheetTitle hidden>Cart</SheetTitle>
                <SheetDescription hidden>View your cart</SheetDescription>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative h-9">
                    <ShoppingCartIcon className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <BuylistCartSheet setCurrentStep={setCurrentStep} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-1">
          <div className="grid h-min auto-rows-auto grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4">
            {searchResults?.map((item, index) => (
              <div key={index} className="h-full">
                <BuyListCatalogItem cardData={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
