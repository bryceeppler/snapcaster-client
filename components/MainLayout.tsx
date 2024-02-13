import React from "react";

type Props = {};

export default function MainLayout({ children }: React.PropsWithChildren<Props>) {
  return (
    <main className="mb-16 flex min-h-screen flex-col items-center justify-between p-2 sm:p-8">
      {children}
    </main>
  );
}
