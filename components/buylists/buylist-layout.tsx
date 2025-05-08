import type { ReactNode } from 'react';

import Cart from './cart';
import ListSelector from './list-selector';

import useBuylistStore from '@/stores/useBuylistStore';
interface BuylistLayoutProps {
  children: ReactNode;
}

const BuylistLayout = ({ children }: BuylistLayoutProps) => {
  const { buylistUIState } = useBuylistStore();
  return (
    <div className="w-full">
      {/* Desktop layout: Fixed sidebars with scrollable main content */}
      <div className="relative">
        {/* Left sidebar - fixed on desktop, 38 units from top, extending to bottom of screen */}
        {buylistUIState !== 'finalSubmissionState' && (
          <div className="lg:top-38 hidden lg:fixed lg:left-0 lg:block lg:h-[calc(100vh-7rem)] lg:w-64 lg:overflow-hidden xl:w-80">
            <ListSelector />
          </div>
        )}

        {/* Right sidebar - fixed on desktop, 38 units from top, extending to bottom of screen */}
        {buylistUIState !== 'finalSubmissionState' && (
          <div className="lg:top-38 hidden lg:fixed lg:right-0 lg:block lg:h-[calc(100vh-7rem)] lg:w-64 lg:overflow-hidden xl:w-80">
            <Cart />
          </div>
        )}

        {/* Main content with calculated margins from sidebars */}
        <div
          className={`min-h-[80vh] p-4 ${
            buylistUIState === 'finalSubmissionState'
              ? 'lg:mx-0'
              : 'lg:mx-64 lg:px-4 xl:mx-80'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default BuylistLayout;
