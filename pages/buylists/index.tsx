import { NextPage } from 'next';
import ResultCard from '@/components/buylists/result-card';
import BuyListSearchBox from '@/components/buylists/buylist-search-box';
import BuyListFilterContainer from '@/components/buylists/buylist-filter-container';
import BuyListCart from '@/components/buylists/buylist-cart';
import { shallow } from 'zustand/shallow';
import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/buyListStore';
type Props = {};

const Buylist: NextPage<Props> = () => {
  const {} = useGlobalStore();
  const { buyListQueryResults, filtersVisibile } = useBuyListStore(
    (state) => ({
      buyListQueryResults: state.buyListQueryResults,
      filtersVisibile: state.filtersVisibile
    }),
    shallow
  );

  return (
    <>
      {/* Mobile */}
      <div className="block min-h-svh md:hidden ">
        <div className="relative mx-auto mb-8  ">
          <BuyListSearchBox />
        </div>
        <div className="mb-8 flex space-x-4">
          <BuyListFilterContainer mobile={true} />
        </div>
        <div className="mb-8">
          <BuyListCart mobile={true} />
        </div>
        Results and Cart Container
        <div className=" ">
          <div className="col-span-7">
            <h1 className="pb-2 text-2xl">Results</h1>

            {buyListQueryResults.map((item: any, key: number) => (
              <div key={key} className="mb-2">
                <ResultCard key={key} cardData={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-svh md:block ">
        <div className="relative mx-auto mb-8 w-4/5 ">
          {/* Search Container*/}
          <BuyListSearchBox />
        </div>
        {/* Filter Container*/}
        <div className="mb-8 w-full">
          <BuyListFilterContainer mobile={false} />
        </div>

        {/* Results and Cart Containers*/}
        <div className="grid grid-cols-12 gap-x-4 ">
          {/* Results Container*/}
          <div className="col-span-7">
            <h1 className="pb-2 text-2xl">Results</h1>
            {/* Results Cards Container*/}

            {buyListQueryResults.map((item: any, key: number) => (
              <div key={key} className="mb-2">
                <ResultCard key={key} cardData={item} />
              </div>
            ))}
          </div>
          {/*  Cart Container*/}
          <div className="col-span-5">
            <BuyListCart mobile={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Buylist;
