import useBuyListStore from '@/stores/buyListStore';
import BuyListCatalogItem from '@/components/buylists/buylist-catalog-item';

export default function Search() {
  const { searchResults } = useBuyListStore();

  return (
    <>
      <div className=" flex flex-col items-center justify-center ">
        {searchResults != null && searchResults.length == 0 && (
          <div className=" flex flex-col  px-4 py-10">
            <div className="flex flex-col items-center ">
              <div
                className="b aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://cdn.prod.website-files.com/603c87adb15be3cb0b3ed9b5/670dd5229626ec1b5f619279_006-min.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="max-w-[480px] text-center text-lg font-bold">
                  No search results found
                </p>
                <p className="max-w-[480px] text-center text-sm font-normal leading-normal ">
                  Please try a searching for a different card.
                </p>
              </div>
            </div>
          </div>
        )}
        {searchResults == null && (
          <div className="col-span-2 flex flex-col  px-4 py-6">
            <div className="flex flex-col items-center">
              <div
                className="aspect-video w-full max-w-[360px] rounded-xl bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://cdn.prod.website-files.com/603c87adb15be3cb0b3ed9b5/670dd5229626ec1b5f619279_006-min.png")'
                }}
              ></div>
              <div className="flex max-w-[480px] flex-col items-center gap-2 ">
                <p className="max-w-[480px] text-center text-lg font-bold">
                  No Results Found
                </p>
                <p className="max-w-[480px] text-center text-sm font-normal leading-normal ">
                  Please try a different search. Make sure you have the correct
                  TCG selected.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8 grid min-h-svh gap-1 md:grid-cols-1">
          <div className="grid h-min auto-rows-auto grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xxl:grid-cols-6">
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
