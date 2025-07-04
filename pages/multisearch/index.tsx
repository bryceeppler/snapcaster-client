import { useRouter } from 'next/router';

import { type NextPage } from 'next';
import { useEffect } from 'react';

import { PageHead } from '@/components/page-head';
import useMultiSearchStore from '@/stores/multiSearchStore';
import { TCG_SELECT_TO_PATH } from '@/utils/tcgPathHelper';

const MultiSearchIndex: NextPage = (): JSX.Element => {
  const router = useRouter();
  const tcg = useMultiSearchStore((state) => state.tcg);

  useEffect(() => {
    // Get the TCG path from the store
    const tcgPath = TCG_SELECT_TO_PATH[tcg] || 'magic-the-gathering';

    // Redirect to the appropriate TCG multisearch page
    router.replace(`/multisearch/${tcgPath}`);
  }, [tcg, router]);

  // Show a loading state while redirecting
  return (
    <>
      <PageHead
        title="Snapcaster | TCG Singles Multi Search Tool 80+ Stores"
        description="Search and compare multiple trading card singles from 80+ Canadian stores—bulk search made easy."
        url="https://www.snapcaster.ca/"
      />

      <main className="flex min-h-screen items-center justify-center">
        <h1 className="sr-only">Snapcaster Multi Search Redirect</h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </main>
    </>
  );
};

export default MultiSearchIndex;
