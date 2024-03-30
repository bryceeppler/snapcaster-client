import { type NextPage } from 'next';
import Head from 'next/head';
import MainLayout from '@/components/MainLayout';
import BlogFeed from '@/components/BlogFeed';
type Props = {};

const BuyersGuide: NextPage<Props> = () => {
  const blogs = [
    {
      title: 'Card Conditions Explained',
      date: 'March 28, 2024',
      link: '/card-guide/condition',
      description:
        'The condition of a card can significantly affect its value. Players can save alot of money when constructing their decks by purchasing cards in lower condtions.',
      image: '/5-condition-page.jpg',
      imageAlt: 'Condition Guide Image'
    },
    {
      title: 'Showcase Cards Explained',
      date: 'March 20, 2024',
      link: '/card-guide/showcase',
      description:
        'Showcase is a catch all term for an alternate version of a card within a set. This guide presents every showcase frame, treatment, and illustration printed.',
      image: '/1-showcase-page.jpg',
      imageAlt: 'Showcase Cards'
    },
    {
      title: 'Prerelease and Promo Cards Explained',
      date: 'March 20, 2024',
      link: '/card-guide/prerelease-and-promo',
      description:
        'In this article we discuss what Prerelease Cards and Promo Cards are as well as the key differences between the two.',
      image: '/2-prerelease-promo-page.jpg',
      imageAlt: 'Pre-release and Promo'
    },
    {
      title: 'Frames and Borders Explained',
      date: 'March 20, 2024',
      link: '/card-guide/frame-and-border',
      description:
        'Prices vary depending on the framing and the border of a card. This guide will do a deep dive on the diffenences between each type of frame and border.',
      image: '/3-frame-border-page.jpg',
      imageAlt: 'Frames and Borders'
    },
    {
      title: 'Foil Types Explained',
      date: 'March 20, 2024',
      link: '/card-guide/foil',
      description:
        'Foiling plays a significant role in the value of your cards. Here, we will go over the 15+ foil treatment options you can buy.',
      image: '/4-foil-page.jpg',
      imageAlt: 'Foil Types'
    }
  ];
  return (
    <>
      <BuyersGuideHead />
      <MainLayout>
        <div className="w-full max-w-2xl flex-1 flex-col justify-center text-center">
          <BlogFeed
            pagetitle="MTG Card Guide"
            pageDescription="A Players Guide to Magic the Gathering Cards."
            blogs={blogs}
          />
        </div>
      </MainLayout>
    </>
  );
};

export default BuyersGuide;
const BuyersGuideHead = () => {
  return (
    <Head>
      <title>Buyers Guide</title>
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
