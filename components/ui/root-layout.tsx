import React from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { useState, useEffect } from 'react';
import useAuthStore from '@/stores/authStore';

type Props = {};

// We can't initialize the store in the store file itself because it needs access to the window object
// to access localStorage. We can't access the window object in the store file because it's a server-side
// file and the window object is not available on the server.

// Maybe there is a better way to initialize the store, but this is the best way I could think of.
const loadLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const initializeState = useAuthStore.getState().initializeState;
    initializeState();
  }
};

export default function Layout({ children }: React.PropsWithChildren<Props>) {
  const [hasInitializedStore, setHasInitializedStore] = useState(false);

  useEffect(() => {
    if (!hasInitializedStore) {
      loadLocalStorage();
      setHasInitializedStore(true);
    }
  }, [hasInitializedStore]);

  return (
    <div className="flex flex-col bg-background">
      <div className="min-h-screen">
        <Navbar />
        <div className="flex-grow">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
