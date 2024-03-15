import React from 'react';

type Props = {};

export default function MainLayout({
  children
}: React.PropsWithChildren<Props>) {
  return (
    <main className="flex min-h-screen flex-col items-center px-2 pb-6 pt-8">
      {children}
    </main>
  );
}
