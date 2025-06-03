import Head from 'next/head';
import Link from 'next/link';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Component() {
  return (
    <>
      <Head>
        <title>Email Verified - Snapcaster</title>
      </Head>
      <main className="mt-16 flex flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Email verified successfully
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your email has been verified. You can now access all features of
            your account.
          </p>
          <div className="mt-6">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/account">Return to Profile</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
