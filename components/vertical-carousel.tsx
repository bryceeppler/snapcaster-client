import React, { useState, useEffect } from 'react';
import VerticalCarouselAd from './vertical-carousel-ad';
import { Ad } from '@/types/ads';

type VerticalCarouselProps = {
  ads: Ad[];
};

const VerticalCarousel: React.FC<VerticalCarouselProps> = ({ ads }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="vertical-carousel relative h-[480px] w-[160px]">
      {ads.map((ad, index) => (
        <div
          key={index}
          className={`carousel-item ${index === activeIndex ? 'active' : 'inactive'}`}
          style={{
            visibility: index === activeIndex ? 'visible' : 'hidden',
            zIndex: index === activeIndex ? 1 : 0,
            transition: index === activeIndex 
              ? 'visibility 0s, z-index 0s, opacity 1s ease-in-out'
              : 'visibility 0s 1s, z-index 0s 1s, opacity 1s ease-in-out',
            opacity: index === activeIndex ? 1 : 0,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <VerticalCarouselAd ad={ad} />
        </div>
      ))}
    </div>
  );
};

export default VerticalCarousel;