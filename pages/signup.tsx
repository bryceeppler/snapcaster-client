import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { type NextPage } from 'next';

import { SignupForm } from '@/components/forms/SignupForm';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Signup: NextPage = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  if (!isInitializing && isAuthenticated) {
    router.push('/account');
  }

  return (
    <>
      <SignupHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your Snapcaster account.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
          <CardFooter>
            <p className="py-1 text-xs ">
              By creating an account, you confirm that you have read,
              understood, and consent to the{' '}
              <Link
                href="/privacy"
                className="text-primary underline hover:opacity-70"
              >
                Privacy Notice
              </Link>{' '}
              and{' '}
              <Link
                href="/terms"
                className="text-primary underline hover:opacity-70"
              >
                Terms & Conditions
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};

export default Signup;

const SignupHead = () => {
  return (
    <Head>
      <title>Sign Up</title>
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
