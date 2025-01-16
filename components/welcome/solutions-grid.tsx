import { GlobeIcon } from '@radix-ui/react-icons';
import { DollarSignIcon, ZapIcon } from 'lucide-react';

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

const features = [
  {
    Icon: DollarSignIcon,
    name: 'Save money',
    description: 'Find the best deals, right here in Canada.',
    href: '/',
    cta: 'Find deals',
    background: (      <div
        className="absolute overflow-hidden opacity-40"
        style={{
          mask: 'radial-gradient(circle at top, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.05) 70%)',
          WebkitMask:
            'radial-gradient(circle at center, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 70%)'
        }}
      >
        <img
          className="mx-auto w-full rotate-12 transform object-cover opacity-60"
          src="/money.png"
        />
      </div>),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3'
  },
  {
    Icon: ZapIcon,
    name: 'Get those hard-to-find cards',
    description: "Never see 'Out of Stock' again.",
    href: '/',
    cta: 'Start searching',
    background: (
      <div
        className="absolute overflow-hidden opacity-40"
        style={{
          mask: 'radial-gradient(circle at top, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.05) 70%)',
          WebkitMask:
            'radial-gradient(circle at center, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 70%)'
        }}
      >
        <img
          className="mx-auto w-full rotate-12 transform object-cover opacity-60"
          src="/popular_cards.png"
        />
      </div>
    ),
    className: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-2'
  },
  {
    Icon: GlobeIcon,
    name: 'Support local game stores',
    description: 'Supports 90+ vendors and counting.',
    href: '/supporters',
    cta: 'Our supporters',
    background: (
      <div
        className="absolute overflow-hidden opacity-40"
        style={{
          mask: 'radial-gradient(circle at top, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.05) 70%)',
          WebkitMask:
            'radial-gradient(circle at center, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1) 70%)'
        }}
      >
        <img
          className="mx-auto w-full -rotate-6 transform object-cover opacity-60"
          src="/lgs.png"
        />
      </div>
    ),
    className: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4'
  }
];

export function SolutionsGrid() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}
