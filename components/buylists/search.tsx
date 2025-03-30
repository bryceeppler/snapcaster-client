import useBuyListStore from '@/stores/useBuylistStore';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';
import { Skeleton } from '@/components/ui/skeleton';

const CatalogItemSkeleton = () => (
  <div className="flex h-full flex-col rounded-md bg-popover p-4">
    <Skeleton className="mx-auto aspect-card w-full max-w-[150px] px-4 md:max-w-[250px]" />
    <div className="mt-2 flex flex-1 flex-col justify-between">
      <div>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-4 w-32" />
        <Skeleton className="mt-1 h-3 w-24" />
      </div>
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  </div>
);

export default function Search({
  createDialogOpen,
  setCreateDialogOpen
}: {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
}) {
  const { searchResults, isLoading } = useBuyListStore();

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {searchResults != null && searchResults.length == 0 && !isLoading && (
          <div className="flex flex-col px-4 py-10">
            <div className="flex flex-col items-center">
              <div
                className="aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://cdn.snapcaster.ca/images/avatar-laptop.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="max-w-[480px] text-center text-lg font-bold">
                  No search results found
                </p>
                <p className="max-w-[480px] text-center text-sm font-normal leading-normal">
                  Please try searching for a different card.
                </p>
              </div>
            </div>
          </div>
        )}
        {searchResults == null && !isLoading && (
          <div className="col-span-2 flex flex-col px-4 py-6">
            <div className="flex flex-col items-center">
              <div
                className="aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://cdn.snapcaster.ca/images/avatar-laptop.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="max-w-[480px] text-center text-lg font-bold">
                  No Results Found
                </p>
                <p className="max-w-[480px] text-center text-sm font-normal leading-normal">
                  Please try a different search. Make sure you have the correct
                  TCG selected.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8 grid min-h-svh w-full gap-1 md:grid-cols-1">
          <div className="grid h-min auto-rows-auto grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xxl:grid-cols-6">
            {isLoading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <CatalogItemSkeleton key={index} />
                ))
              : searchResults?.map((item, index) => (
                  <div key={index} className="h-full">
                    <BuyListCatalogItem
                      cardData={item}
                      createDialogOpen={createDialogOpen}
                      setCreateDialogOpen={setCreateDialogOpen}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
