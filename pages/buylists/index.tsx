import { NextPage } from 'next';
import ResultCard from '@/components/buylists/result-card';
import BuyListSearchBox from '@/components/buylists/buylist-search-box';
import BuyListFilterContainer from '@/components/buylists/buylist-filter-container';
import BuyListCart from '@/components/buylists/buylist-cart';
import useGlobalStore from '@/stores/globalStore';
import useBuyListStore from '@/stores/buyListStore';
import { useState, useEffect } from 'react';
import BackToTopButton from '@/components/ui/back-to-top-btn';
import SinglePagination from '@/components/single-search/single-pagination';
import Homebanner from '@/components/homebanner';
type Props = {};
const Buylist: NextPage<Props> = () => {
  return (
    <div className="mx-auto w-min whitespace-nowrap">🚧 Coming Soon 🚧</div>
  );
};
// const Buylist: NextPage<Props> = () => {
//   const {} = useGlobalStore();
//   const {
//     buyListQueryResults,
//     showFilters,
//     currentPage,
//     totalPages,
//     resultsTotal,
//     setCurrentPage,
//     fetchCards
//   } = useBuyListStore();
//   const useMediaQuery = (width: number): boolean => {
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//       const handleResize = () => setIsMobile(window.innerWidth <= width);
//       window.addEventListener('resize', handleResize);
//       handleResize(); // Call once to set the initial value

//       return () => window.removeEventListener('resize', handleResize);
//     }, [width]);

//     return isMobile;
//   };
//   const isMobile = useMediaQuery(768);
//   return (
//     <>
//       <div className=" min-h-svh ">
//         <div className="mb-6 flex w-full flex-col justify-center gap-8 text-center">
//           <Homebanner prefixText={'Sell'} />
//         </div>

//         <div className="relative mx-auto mb-8 w-full md:w-4/5 ">
//           {/* Search Container*/}
//           <BuyListSearchBox />
//         </div>
//         {/* Filter Container*/}
//         {showFilters && (
//           <div className="mb-4 w-full">
//             <BuyListFilterContainer mobile={isMobile} />
//           </div>
//         )}
//         {isMobile && (
//           <div className="md:col-span-5">
//             <BuyListCart mobile={true} />
//           </div>
//         )}
//         {/* Results and Cart Containers*/}
//         <div className="mt-8 w-full md:grid md:grid-cols-12 md:gap-x-4  ">
//           {/* Results Container*/}
//           <div className=" md:col-span-7">
//             <div className="mb-2 flex flex-col text-left capitalize">
//               <h1 className="text-2xl font-bold">Search Results</h1>

//               <p className="text-sm text-gray-500">
//                 {resultsTotal} results found
//               </p>
//             </div>
//             {/* Results Cards Container*/}

//             {buyListQueryResults.map((item: any, key: number) => (
//               <div key={key} className="mb-2">
//                 <ResultCard key={key} cardData={item} />
//               </div>
//             ))}
//           </div>
//           {/*  Cart Container*/}
//           {!isMobile && (
//             <div className="md:col-span-5">
//               <BuyListCart mobile={false} />
//             </div>
//           )}
//         </div>
//         {totalPages > 0 && (
//           <SinglePagination
//             currentPage={currentPage}
//             setCurrentPage={setCurrentPage}
//             numPages={totalPages}
//             fetchCards={fetchCards}
//           />
//         )}
//         <BackToTopButton />
//       </div>
//     </>
//   );
// };

export default Buylist;
