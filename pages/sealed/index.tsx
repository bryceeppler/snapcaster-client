import { useRouter } from 'next/router';

import { type NextPage } from 'next';
import { useEffect } from 'react';

import { PageHead } from '@/components/page-head';
import { useSealedSearchStore } from '@/stores/useSealedSearchStore';
import { TCG_SELECT_TO_PATH } from '@/utils/tcgPathHelper';

const SealedIndex: NextPage = (): JSX.Element => {
  const router = useRouter();
  const productCategory = useSealedSearchStore(
    (state) => state.productCategory
  );

  useEffect(() => {
    // Get the TCG path from the store
    const tcgPath =
      TCG_SELECT_TO_PATH[productCategory] || 'magic-the-gathering';

    // Redirect to the appropriate TCG sealed page
    router.replace(`/sealed/${tcgPath}`);
  }, [productCategory, router]);

  // Show a loading state while redirecting
  return (
    <>
      <PageHead
        title="Snapcaster | Buy Sealed TCG Packs and Boxes from 80+ Canadian Stores"
        description="The best place to shop sealed trading card products across Canada. Boxes, packs, and more — Fast, Reliable, Local."
        url="https://snapcaster.ca/sealed"
      />

      <main className="flex min-h-screen items-center justify-center">
        <h1 className="sr-only">Snapcaster Sealed Search Redirect</h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </main>
    </>
  );
};

export default SealedIndex;
