import { PageHead } from '@/components/page-head';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import {
  TCG_PATHS,
  PRETTY_NAMES,
  getPopularClickedSets
} from '@/utils/tcgPathHelper';
import BuylistCatalog from '@/components/buylists/buylist-catalog-container';
import BuylistLayout from '@/components/buylists/buylist-layout';
interface TCGPageProps {
  tcgPath: string;
  prettyName: string;
  sets: string[];
}

const TCGPage: NextPage<TCGPageProps> = ({ tcgPath, prettyName, sets }) => {
  const setsDescription =
    sets.length > 0
      ? `Sell ${prettyName} singles and compare buylist prices across Canada.Cash or credit ${sets
          .map((set) => `${set}`)
          .join(', ')}, and more`
      : `Sell ${prettyName} singles and compare buylist prices across Canada. Get cash or credit for your singles`;

  return (
    <>
      <h1 className="sr-only">
        Sell Trading Card Singles And Compare Buylist Prices Across Canada
      </h1>
      <PageHead
        title={`Snapcaster | Sell and Compare ${prettyName} Prices Across Canada`}
        description={setsDescription}
        url={`https://snapcaster.ca/buylists/${tcgPath}`}
      />

      <BuylistLayout>
        <BuylistCatalog />
      </BuylistLayout>
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
