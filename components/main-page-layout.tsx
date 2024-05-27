import React from 'react';
import useGlobalStore from '@/stores/globalStore';
type Props = {};

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  const { adsEnabled } = useGlobalStore();
  return (
    <main className="container w-full max-w-5xl flex-1 flex-col items-center justify-center px-2 py-8">
      {adsEnabled && (
        <>
          {/* top banner */}
          <div className="flex h-40 w-full items-center justify-center rounded border border-zinc-600 bg-zinc-700">
            Tier 1 Ad
          </div>
          {/* left ad */}
          <div className="fixed left-10 top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex">
            Tier 1 Ad
          </div>
          {/* right ad */}
          <div className="fixed right-10 top-1/4 hidden h-1/2 w-40 items-center justify-center rounded border border-zinc-600 bg-zinc-700 xl:flex xl:flex-col">
            <span className="flex flex-grow items-center justify-center">
              Tier 2 Ad
            </span>
            <div className="mt-auto flex justify-center gap-1 pb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-zinc-600"></div>
              ))}
            </div>
          </div>
        </>
      )}
      <div className="mt-8">{children}</div>
    </main>
  );
}
