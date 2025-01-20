import React from 'react';
import Joyride, { Step, CallBackProps, STATUS, TooltipRenderProps } from 'react-joyride';

interface Props {
  run: boolean;
  onFinish: () => void;
}

const Tooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  skipProps,
  isLastStep,
}: TooltipRenderProps) => (
  <div {...tooltipProps} className="p-6 bg-background rounded-lg shadow-[0_0_0_1px_hsl(var(--border))] font-inter w-[300px] text-foreground">
    <div className="flex justify-between items-start mb-4">
      <div className="text-lg font-medium font-inter">{step.title}</div>
      <button {...closeProps} className="text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div className="text-sm text-muted-foreground mb-6 font-inter">{step.content}</div>
    <div className="flex justify-between items-center font-inter">
      {continuous && (
        <button {...backProps} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
      )}
      <div className="flex gap-3 ml-auto">
        <button {...skipProps} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Skip tour
        </button>
        <button {...primaryProps} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          {isLastStep ? 'Finish' : 'Continue →'}
        </button>
      </div>
    </div>
  </div>
);

export const InteractiveGuide = ({ run, onFinish }: Props) => {
  const steps: Step[] = [
    {
      target: '.help-button',
      title: 'Help Guide',
      content: 'Click here anytime to see the help guide and start this tour again',
      placement: 'bottom',
    },
    {
      target: '.back-button',
      title: 'Navigation',
      content: 'Click here to go back to the search page',
      placement: 'bottom',
    },
    {
      target: '.cart-button',
      title: 'Shopping Cart',
      content: 'View your cart here.',
      placement: 'bottom',
    },
    {
      target: '.export-cart-button',
      title: 'Export Cart',
      content: 'Export your cart as a text file to share with friends.',
      placement: 'bottom',
    },
    {
      target: '.recommended-stores',
      title: 'Store Recommendations',
      content: 'This section shows our recommended stores for your search, sorted by availability and price.',
      placement: 'top',
    },
    {
      target: '.store-availability',
      title: 'Card Availability',
      content: 'Click here to see which cards are available or not available at this store.',
      placement: 'top',
    },
    {
      target: '.store-checkout',
      title: 'Quick Checkout',
      content: 'Click here to proceed directly to checkout with all available cards from this store.',
      placement: 'top',
    },
    {
      target: '.results-container',
      title: 'Search Results',
      content: 'This is the results container. It shows the results of your search.',
      placement: 'top',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling={true}
      scrollOffset={0}
      tooltipComponent={Tooltip}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          textColor: 'hsl(var(--foreground))',
          backgroundColor: 'hsl(var(--background))',
          arrowColor: 'hsl(var(--background))',
          zIndex: 1000,
          overlayColor: 'rgba(0, 0, 0, 0.4)',
        },
        spotlight: {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
        tooltip: {
          borderRadius: '8px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
      }}
      floaterProps={{
        disableAnimation: true,
        styles: {
          arrow: {
            color: 'hsl(var(--border))',
            length: 14,
            spread: 20,
          },
          container: {
            filter: 'drop-shadow(0 0 0 1px hsl(var(--border)))',
          },
        },
      }}
      callback={handleJoyrideCallback}
    />
  );
}; 