import { useRouter } from 'next/router';
import { type NextPage } from 'next';
import React from 'react';
import SignInForm from '@/components/forms/SigninForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PageHead } from '@/components/page-head';

const Signin: NextPage = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  if (router.query.password_reset) {
    toast({
      title: 'Password reset',
      description: 'Your password has been reset'
    });
  }

  if (!isInitializing && isAuthenticated) {
    router.push('/account');
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <h1 className="sr-only">Sign In To Your Snapcaster Account</h1>
      <PageHead
        title="Snapcaster | Sign In"
        description="Access your Snapcaster account to manage your account, buylists, and discord integration."
        url="https://snapcaster.ca/signin"
      />

      <section className="flex w-full justify-center py-6 md:py-12">
        <SignInForm />
      </section>
    </>
  );
};

export default Signin;
