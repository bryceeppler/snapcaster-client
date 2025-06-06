import Head from 'next/head';
import Link from 'next/link';

import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Component() {
  return (
    <>
      <Head>
        <title>Verification Failed - Snapcaster</title>
      </Head>
      <main className="mt-16 flex flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto w-fit rounded-full bg-destructive/10 p-3 text-destructive">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't verify your email. The verification link may have
            expired or is invalid.
          </p>
          <div className="mt-6 space-y-4">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/account">Return to Profile</Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
