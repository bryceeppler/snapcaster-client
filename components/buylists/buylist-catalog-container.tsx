import React, { useState } from 'react';
import useBuyListStore from '@/stores/buyListStore';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import SavedLists from './saved-lists';
import Search from './search';
import Checkout from './checkout/checkout';
import Review from './review';
import { toast } from 'sonner';

const steps = [
  { label: 'My Lists', mode: 'cart' },
  { label: 'Add Cards to Your Buylist', mode: 'search' },
  { label: 'Submit Buylist', mode: 'checkout' },
  { label: 'Review', mode: 'review' }
];

export default function BuylistCatalog() {
  const { currentCartId, getCheckoutData } = useBuyListStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [animateToStep, setAnimateToStep] = useState(0);

  const goToStep = (step: number) => {
    if (step > 0 && !currentCartId) {
      toast.error('Please select or create a cart first');
      return;
    }

    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  useEffect(() => {
    if (currentStep > 0 && !currentCartId) {
      setCurrentStep(0);
      return;
    }
    if (currentStep > 1 && currentCartId) {
      getCheckoutData(currentCartId);
    }
    const timer = setTimeout(() => {
      setAnimateToStep(currentStep);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, currentCartId]);

  return (
    <>
      <div>
        <div className=" flex flex-col gap-1 rounded-lg  p-2">
          <h1 className="text-center font-bold">
            {currentStep + 1}. {steps[currentStep].label}
          </h1>
          {/* 1234 navigation */}
          <div className="max-w-lg mx-auto w-full">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>

            <div className="mx-2 flex flex-grow items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-grow items-center last:flex-grow-0"
                >
                  <button
                    onClick={() => goToStep(index)}
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-montserrat font-medium transition-colors ${
                      index <= currentStep
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-500 text-gray-500'
                    } ${
                      index < currentStep
                        ? 'cursor-pointer'
                        : index > currentStep || (index > 0 && !currentCartId)
                        ? 'cursor-not-allowed'
                        : ''
                    }`}
                    disabled={
                      index > currentStep || (index > 0 && !currentCartId)
                    }
                  >
                    {index < currentStep ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="relative mx-1 h-0.5 flex-grow bg-gray-500">
                      <div
                        className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-in-out"
                        style={{
                          width: index < animateToStep ? '100%' : '0%'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => goToStep(currentStep + 1)}
              disabled={currentStep === steps.length - 1}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
          </div>
        </div>

        <div className="mt-4">
          {currentStep === 0 ? (
            <SavedLists setCurrentStep={setCurrentStep} />
          ) : currentStep === 1 ? (
            <Search setCurrentStep={setCurrentStep} />
          ) : currentStep === 2 ? (
            <Checkout setCurrentStep={setCurrentStep} />
          ) : (
            currentStep === 3 && <Review setCurrentStep={setCurrentStep} />
          )}
        </div>
      </div>
    </>
  );
}
