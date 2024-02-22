import { type NextPage } from 'next';
import Head from 'next/head';
import UpdateFeed from '@/components/UpdateFeed';

import MainLayout from '@/components/MainLayout';
type Props = {};


const Updates: NextPage<Props> = () => {
  const updates = [
    {
      title: "Removing Store",
      date: "Feb 22, 2024",
      description:"North of Exile Games no longer sells MTG singles."
    },
    {
      title: "5 new stores added.",
      date: "Feb 17, 2024",
      description:"Adding Dragon Fyre Games, Carta Magica Montreal, Carta Magica Ottawa, Free Game, and Gods Arena."
    },
    {
      title:"All the stores are back!",
      date: "Feb 16, 2024",
      description: "All the stores are back and working as expected. Thanks for your patience."
    },
    {
      title:"Adding store.",
      date: "Feb 15, 2024",
      description: "Adding Fetch Shock Games."
    },
    {
      title:"Adding 6 new stores.",
      date: "Feb 14, 2024",
      description: "Adding support for Boutique Awesome, Gaming Kingdom, Lukes Cards, Mecha Games, Multizone, and Trinity Hobby."
    },
    {
      title: 'Big backend changes.',
      date: 'Feb 11, 2024',
      description:
        "I've made some changes that should improve performance and reliability. Some stores have been temporarily removed as I work on getting them integrated with the new backend system. Thanks for your support and patience!"
    },
    {
      title: 'Bug fixes for multi search.',
      date: 'Nov 15, 2023',
      description: ''
    },
    {
      title:
        'Added Fan of the Sport and Kingdom of the Titans to single search.',
      date: 'Aug 22, 2023',
      description: ''
    },
    {
      title: 'Added Level Up Games to single search.',
      date: 'Aug 8, 2023',
      description: ''
    },
    {
      title: 'Updates for 20+ stores using BinderPOS.',
      date: 'Aug 5, 2023',
      description: ''
    },
    {
      title: 'Bugfixes for multiple BinderPOS stores.',
      date: 'July 24, 2023',
      description: ''
    },
    {
      title: 'Added 14 new stores to single search.',
      date: 'July 12 2023',
      description: ''
    },
    {
      title: 'Added 8 new stores to single search.',
      date: 'July 11 2023',
      description: ''
    },
    {
      title:
        'Bug fixes for FantasyForged, 401 Games, OrachardCity, Kanatacg, EnterTheBattlefield, GameKnight',
      date: 'July 11 2023',
      description: ''
    },
    {
      title: 'Bug fixes for Fantasy Forged.',
      date: 'Apr 14 2023',
      description: ''
    },
    {
      title: 'Price monitoring and watchlist added.',
      date: 'Mar 28 2023',
      description: ''
    },
    {
      title: 'Bug fixes and FaceToFace added to sealed search.',
      date: 'Mar 27 2023',
      description: ''
    },
    {
      title:
        'GameKnight, OrchardCity, ExorGames, SequenceGaming added to sealed.',
      date: 'Mar 26 2023',
      description: ''
    },
    {
      title: 'EverythingGames,  FantasyForged, FirstPlayer added to sealed.',
      date: 'Mar 26 2023',
      description: ''
    },
    {
      title: 'Popular set carousel added.',
      date: 'Mar 26 2023',
      description: ''
    },
    {
      title: 'Bug fixes and popular card carousel added.',
      date: 'Mar 25 2023',
      description: ''
    },
    {
      title: 'EnterTheBattlefield added to sealed search.',
      date: 'Mar 18 2023',
      description: ''
    },
    {
      title: 'Gamezilla, Aethervault, Atlas, BorderCity added to sealed.',
      date: 'Mar 13 2023',
      description: ''
    },
    {
      title: 'HairyT, Chimera, ComicHunter, TopdeckHero added to sealed.',
      date: 'Mar 12 2023',
      description: ''
    },
    {
      title: 'Price history graphs added to single search.',
      date: 'Mar 11 2023',
      description: ''
    },
    {
      title: 'Chimera Gaming added to single search.',
      date: 'Mar 11 2023',
      description: ''
    }
  ];
  return (
    <>
      <UpdatesHead />
      <MainLayout>
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          <UpdateFeed updates={updates} />
        </div>
      </MainLayout>
    </>
  );
};

export default Updates;

const UpdatesHead = () => {
  return (
    <Head>
      <title>Updates</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
