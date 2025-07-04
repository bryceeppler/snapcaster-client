import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { type NextPage } from 'next';

import { SignupForm } from '@/components/forms/SignupForm';
import { PageHead } from '@/components/page-head';
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
      <PageHead
        title="Snapcaster | Sign Up"
        description="Create a Snapcaster account and manage your buylists, pro features, and discord integration."
        url="https://www.snapcaster.ca/signup"
      />

      <main className="flex w-full justify-center py-6 md:py-12">
        <h1 className="sr-only">Create Your Snapcaster Account</h1>
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
      </main>
    </>
  );
};

export default Signup;
