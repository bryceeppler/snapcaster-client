import { PageHead } from '@/components/page-head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import SealedCatalogContainer from '@/components/sealed/sealed-catalog-container';
import { useSealedSearch } from '@/hooks/queries/useSealedSearch';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import {
  TCG_PATHS,
  PRETTY_NAMES,
  getPopularClickedSets
} from '@/utils/tcgPathHelper';

interface TCGPageProps {
  tcgPath: string;
  prettyName: string;
  sets: string[];
}

const TCGPage: NextPage<TCGPageProps> = ({ tcgPath, prettyName, sets }) => {
  const {
    productCategory,
    searchTerm,
    selectedFilters,
    sortBy,
    region,
    clearFilters
  } = useSealedSearchStore();

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch
  } = useSealedSearch(
    {
      productCategory,
      searchTerm,
      selectedFilters,
      sortBy,
      region
    },
    { enabled: true }
  );

  const setsDescription =
    sets.length > 0
      ? `Search and compare ${prettyName} singles from 80+ Canadian stores. Buy top ${prettyName} trading card sets like ${sets
          .map((set) => `${set}`)
          .join(', ')}. Fast, Reliable, Local.`
      : `Search and compare ${prettyName} singles from 80+ Canadian stores. Fast, Reliable, Local.`;

  return (
    <>
      <PageHead
        title={`Snapcaster | Buy ${prettyName} Singles from 80+ Stores`}
        description={setsDescription}
        url={`https://snapcaster.ca/sealed/${tcgPath}`}
      />
      <div className="flex w-full flex-col justify-center text-center">
        <SealedCatalogContainer
          refetch={refetch}
          isLoading={isLoading}
          clearFilters={clearFilters}
          searchResults={data?.searchResults || []}
          promotedResults={data?.promotedResults || []}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = TCG_PATHS.map((tcgPath) => ({
    params: { tcgPath }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const tcgPath = params?.tcgPath as string;

  const sets = await getPopularClickedSets(tcgPath);

  return {
    props: {
      tcgPath,
      prettyName: PRETTY_NAMES[tcgPath] || tcgPath,
      sets: sets.slice(0, 3)
    },
    revalidate: 86400 // Rebuild once a day
  };
};

export default TCGPage;
