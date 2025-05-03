import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const BuylistBackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      // Only show button when user has scrolled down
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position
    toggleVisibility();

    // Add scroll event listener
    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-200 md:right-8 lg:right-[calc(33%-1rem)] xl:right-[calc(25%-1rem)] xxl:right-[calc(20%-1rem)] ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Button
        onClick={scrollToTop}
        className="aspect-square rounded-full bg-primary p-3 text-primary-foreground shadow-md hover:bg-primary/80"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </Button>
    </div>
  );
};

export default BuylistBackToTopButton;
