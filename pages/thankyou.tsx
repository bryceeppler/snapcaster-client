import Head from 'next/head';
import Link from 'next/link';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Component() {
  return (
    <>
      <Head>
        <title>Thank You - Snapcaster</title>
      </Head>
      <main className="mt-16 flex flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto w-fit rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Thank you for your subscription!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your payment was successful and your subscription is now active.
          </p>
          <div className="mt-6">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
