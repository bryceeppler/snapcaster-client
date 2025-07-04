import { useRouter } from 'next/router';

import { type NextPage } from 'next';
import { useEffect } from 'react';

import { PageHead } from '@/components/page-head';
import useBuylistStore from '@/stores/useBuylistStore';
import { TCG_SELECT_TO_PATH } from '@/utils/tcgPathHelper';

const BuylistsIndex: NextPage = (): JSX.Element => {
  const router = useRouter();
  const tcg = useBuylistStore((state) => state.tcg);

  useEffect(() => {
    // Get the TCG path from the store
    const tcgPath = TCG_SELECT_TO_PATH[tcg] || 'magic-the-gathering';

    // Redirect to the appropriate TCG buylist page
    router.replace(`/buylists/${tcgPath}`);
  }, [tcg, router]);

  // Show a loading state while redirecting
  return (
    <>
      <PageHead
        title="Snapcaster | Buylista"
        description="Buylist"
        url="https://snapcaster.ca/buylists"
      />

      <main className="flex min-h-screen items-center justify-center">
        <h1 className="sr-only">Snapcaster Buylist Redirect</h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </main>
    </>
  );
};

export default BuylistsIndex;
