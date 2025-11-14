import { type NextPage } from 'next';

import Homebanner from '@/components/homebanner';
import { PageHead } from '@/components/page-head';
import SearchBar from '@/components/search-ui/search-bar';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';

const Home: NextPage = () => {
  const {
    searchResults,
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters,
    isLoading,
    setIsLoading,
    setCurrentPage
  } = useSingleSearchStore();

  return (
    <>
      <PageHead
        title="Snapcaster | Search TCG Singles From 80+ Stores In Canada"
        description="The best place to shop trading card singles online from 80+ stores throughout Canada. Magic the Gathering, Pokemon, Yu-Gi-Oh, Lorcana, One Piece, Star Wars Unlimited, Flesh and Blood."
        url="https://www.snapcaster.ca/"
      />
      <main className="flex w-full flex-col justify-center text-center">
        <h1 className="sr-only">Buy Trading Cards Online In Canada</h1>
        <div className="flex w-full justify-center bg-red-300 p-2 text-center">
          Nov 14th 8:00 AM PST: We're undergoing maintenance for a few hours
          while me make some changes, sorry for the inconvenience! You may
          notice some missing results or cards.
        </div>
        {!searchResults && (
          <div className="flex flex-col items-center justify-center md:mt-6">
            <Homebanner prefixText={'Search for'} />
            <div className="mx-auto mt-6 flex w-full justify-center">
              <SearchBar
                searchTool="single"
                tcg={tcg}
                searchTerm={searchTerm}
                setTcg={setTcg}
                setSearchTerm={setSearchTerm}
                clearSearchResults={clearSearchResults}
                fetchCards={fetchCards}
                clearFilters={clearFilters}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        )}
        {searchResults && <SingleCatalog />}
      </main>
    </>
  );
};

export default Home;
