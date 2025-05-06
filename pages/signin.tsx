import { type NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import React from 'react';
import SignInForm from '@/components/forms/SigninForm';

type Props = {};
const Signin: NextPage<Props> = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const { redirect } = router.query;

  if (!isInitializing && isAuthenticated) {
    router.push('/account');
  }

  // Show loading or signin form
  if (isAuthenticated) {
    return null; // Return empty while redirecting
  }

  return (
    <>
      <SigninHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <SignInForm
          redirectUrl={
            redirect ? decodeURIComponent(redirect as string) : undefined
          }
        />
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
