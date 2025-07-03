import { type NextPage } from 'next';
import Homebanner from '@/components/homebanner';
import SearchBar from '@/components/search-ui/search-bar';
import SingleCatalog from '@/components/single-search/single-catalog-container';
import { useSingleSearchStore } from '@/stores/useSingleSearchStore';
import { PageHead } from '@/components/page-head';

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
      <h1 className="sr-only">Buy Trading Cards Online In Canada</h1>
      <PageHead
        title="Snapcaster | Search TCG Singles From 80+ Stores In Canada"
        description="The best place to shop trading card singles online across 80+ stores across Canada. Magic the Gathering, Pokemon, Yu-Gi-Oh, Lorcana, One Piece, Star Wars Unlimted, Flesh and Blood."
        url="https://snapcaster.ca"
      />
      <div className="flex w-full flex-col justify-center text-center">
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
      </div>
    </>
  );
};

export default Home;
