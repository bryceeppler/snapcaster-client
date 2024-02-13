import React from "react";

type Props = {};

export default function MainLayout({ children }: React.PropsWithChildren<Props>) {
  return (
    <main className="mb-16 flex min-h-screen flex-col items-center justify-between py-2 px-4 sm:p-8">
      {children}
    </main>
  );
}
