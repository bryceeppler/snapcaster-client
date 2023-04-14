import { type NextPage } from 'next';
import Head from 'next/head';
import Homebanner from '@/components/Homebanner';
import SingleSearchbox from '@/components/SingleSearchbox';
import Loadingspinner from '@/components/Loadingspinner';
import SingleSearchInfo from '@/components/SingleSearchInfo';
import SearchFilters from '@/components/SingleSearchFilters';
import { useStore } from '@/store';
import SingleCatalog from '@/components/SingleCatalog';
import { useUser } from '@/utils/useUser';
import PriceHistory from '@/components/PriceHistory';
import Updates from '@/components/Updates';
import PopularCards from '@/components/PopularCards';
import axios from 'axios';
import { CardInfo } from '@/components/PopularCards';
import { useEffect, useState } from 'react';

type Props = {
};


const Home: NextPage<Props> = () => {
  const {
    singleSearchResults,
    singleSearchResultsLoading,
    priceChartLoading,
    singleSearchPriceList,
    singleSearchStarted,
    singleSearchQuery
  } = useStore();
  const { user, isLoading, subscription } = useUser();
  const [popularCards, setPopularCards] = useState<CardInfo[]>([]);

  useEffect(() => {
    const res = axios.get(
      `${process.env.NEXT_PUBLIC_SNAPCASTER_API_URL}/utils/popular_cards/`
    ).then(res => res.data).then(data => {
      let popularCards = [...data.monthly, ...data.weekly];
      // remove duplicates
      popularCards = popularCards.filter(
        (card, index, self) =>
          index === self.findIndex((t) => t.name === card.name)
      );
      setPopularCards(popularCards);
    })

    // let popularCards = [...res.data.monthly, ...res.data.weekly];
    // // remove duplicates
    // popularCards = popularCards.filter(
    //   (card, index, self) =>
    //     index === self.findIndex((t) => t.name === card.name)
    // );
    // setPopularCards(popularCards);
  }, []);
  
  const updates = [
    {
      title: "Bug fixes for Fantasy Forged.",
      date: "Apr 14 2023"
    },
    {
      title: "Price monitoring and watchlist added.",
      date: "Mar 28 2023"
    },
    {
      title: "Bug fixes and FaceToFace added to sealed search.",
      date: "Mar 27 2023"
    },
    {
      title: "GameKnight, OrchardCity, ExorGames, SequenceGaming added to sealed.",
      date: "Mar 26 2023"
    },
    {
      title: "EverythingGames,  FantasyForged, FirstPlayer added to sealed.",
      date: "Mar 26 2023"
    },
    {
      title: "Popular set carousel added.",
      date: "Mar 26 2023"
    },
    {
      title: "Bug fixes and popular card carousel added.",
      date: "Mar 25 2023"
    },
    { title: "EnterTheBattlefield added to sealed search.",
      date: "Mar 18 2023"
    },
    { title: "Gamezilla, Aethervault, Atlas, BorderCity added to sealed.",
      date: "Mar 13 2023"
    },
    {
      title: "HairyT, Chimera, ComicHunter, TopdeckHero added to sealed.",
      date: "Mar 12 2023"
    },
    {
      title: "Price history graphs added to single search.",
      date: "Mar 11 2023"
    },
    {
      title: "Chimera Gaming added to single search.",
      date: "Mar 11 2023"
    },
  ]
  return (
    <>
      <HomeHead />
      <main className="flex min-h-screen flex-col items-center justify-between p-2 sm:p-8 mb-16">
     <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          {Object.keys(singleSearchResults).length === 0 &&
            !singleSearchStarted && (
              <div>
                <Homebanner />
              </div>
            )}
          {/* <SingleSearchbox includePriceChart={subscription?.status === "active"}/> */}
          <SingleSearchbox includePriceChart={true} />
          {/* <div className="flex justify-center items-center h-28 bg-zinc-900 bg-opacity-5 w-full">
          <ins
            className="adsbygoogle"
            //  style="display:block"
            data-ad-client="ca-pub-6026504058618942"
            data-ad-slot="4085824286"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins> 
          </div> */}
          {
           !singleSearchStarted && !singleSearchResultsLoading && (
            <div className="space-y-16 mt-16">
              <PopularCards popularCards={popularCards}/>
              <Updates data={updates}/>
            </div>
           ) 
          }
          {singleSearchResultsLoading && (
            <div className="flex items-center justify-center pt-5">
              <Loadingspinner />
            </div>
          )}
          {!priceChartLoading && singleSearchQuery &&
            <PriceHistory />
          }
          {Object.keys(singleSearchResults).length > 0 && (
            <>
              <SingleSearchInfo />
              <SearchFilters />
              <SingleCatalog />
            </>
          )}
          {singleSearchStarted &&
            !singleSearchResultsLoading &&
            Object.keys(singleSearchResults).length === 0 && (
              <div className="flex items-center justify-center pt-5">
                <p className="text-gray-500">No results found</p>
              </div>
            )}
        </div>
      </main>
    </>
  );
};

export default Home;

const HomeHead = () => {
  return (
    <Head>
      <title>snapcaster</title>
      <meta
        name="description"
        content="Search for Magic the Gathering singles in Canada"
      />
      <meta
        property="og:title"
        content={`snapcaster - Search for Magic: the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find your Magic the Gathering singles and sealed product using snapcaster. Search over 20 Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

