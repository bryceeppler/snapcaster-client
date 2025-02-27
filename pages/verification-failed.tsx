import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

export default function Component() {
  return (
    <>
      <Head>
        <title>Verification Failed - Snapcaster</title>
      </Head>
      <main className="flex flex-col items-center justify-center bg-background p-4 mt-16">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive w-fit mx-auto">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Verification failed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't verify your email. The verification link may have expired or is invalid.
          </p>
          <div className="mt-6 space-y-4">
            <Button asChild variant="default" className="w-full sm:w-auto">
              <Link href="/profile">
                Return to Profile
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
