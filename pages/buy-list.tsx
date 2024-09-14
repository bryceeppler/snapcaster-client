import { NextPage } from 'next';
import ResultCard from '@/components/buy-list/result-card';

import BuyListSearchBox from '@/components/buy-list/buylist-search-box';
import BuyListFilterContainer from '@/components/buy-list/buylist-filter-container';

import FilterDropDownMultiple from '@/components/buy-list/filter-drop-down-multiple';

import BuyListCart from '@/components/buy-list/buylist-cart';
import useBuyListStore from '@/stores/buyListStore';

type Props = {};

const Buylist: NextPage<Props> = () => {
  const { buyListQueryResults } = useBuyListStore();
  return (
    <>
      {/* Mobile */}
      <div className="block min-h-svh md:hidden ">
        <div className="relative mx-auto mb-8  ">
          {/* Search Container*/}
          <BuyListSearchBox />
        </div>
        {/* Filter Container*/}
        <div className="mb-8 flex space-x-4">
          <BuyListFilterContainer mobile={true} />
        </div>
        {/* View Cart Container */}
        <div className="mb-8">
          <BuyListCart mobile={true} />
        </div>
        {/* Results and Cart Container*/}
        <div className=" ">
          {/* Results Container*/}
          <div className="col-span-7">
            <h1 className="pb-2 text-2xl">Results</h1>
            {/* Results Cards Container*/}
            <div>
              <ResultCard cardData={buyListQueryResults[0]} />
            </div>
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
        <div className="mb-8 flex">
          <BuyListFilterContainer mobile={false} />
        </div>

        {/* Results and Cart Container*/}
        <div className="grid grid-cols-12 gap-x-4 ">
          {/* Results Container*/}
          <div className="col-span-7">
            <h1 className="pb-2 text-2xl">Results</h1>
            {/* Results Cards Container*/}
            <div>
              {buyListQueryResults.map((item: any, key: number) => (
                <ResultCard key={key} cardData={item} />
              ))}
            </div>
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
