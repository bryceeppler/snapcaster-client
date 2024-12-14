import { type NextPage } from 'next';
import Head from 'next/head';
import useAuthStore from '@/stores/authStore';
import Profile from './profile';
import SignInCard from '@/components/signin';

type Props = {};
const Signin: NextPage<Props> = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Profile />;
  }

  return (
    <>
      <SigninHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <SignInCard />
      </section>
    </>
  );
};

export default Signin;

const SigninHead = () => {
  return (
    <Head>
      <title>Sign In</title>
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
