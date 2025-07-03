'use client';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define sponsor tiers with types
type Sponsor = {
  id: number;
  name: string;
  href: string;
  logo: string;
};

type SponsorTier = {
  title: string;
  sponsors: Sponsor[];
  cardClassName: string;
  titleClassName?: string;
};

export default function SponsorSection() {
  // Organize sponsors into tiers
  const sponsorTiers: SponsorTier[] = [
    {
      title: 'Tier 1 Sponsors',
      sponsors: [
        {
          id: 1,
          name: 'Obsidian Games',
          href: 'https://obsidiangames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/obsidian_supporter.png'
        },
        {
          id: 2,
          name: 'Exor Games',
          href: 'https://exorgames.com?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/supporters/exorgames_supporter.png'
        },
        {
          id: 3,
          name: 'Chimera Gaming',
          href: 'https://chimeragamingonline.com/?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/supporters/chimera_supporter.png'
        }
      ],
      cardClassName:
        'overflow-hidden border-2 border-primary/20 transition-all duration-200 hover:border-primary/50 hover:shadow-md',
      titleClassName: 'text-xl font-bold'
    },
    {
      title: 'Tier 2 Sponsors',
      sponsors: [
        {
          id: 1,
          name: 'Level Up Games',
          href: 'https://levelupgames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/supporters/levelup_supporter.png'
        },
        {
          id: 3,
          name: 'House of Cards',
          href: 'https://houseofcards.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/supporters/hoc_supporter.png'
        }
      ],
      cardClassName:
        'overflow-hidden border-2 border-primary/20 transition-all duration-200 hover:border-primary/50 hover:shadow-md',
      titleClassName: 'text-lg font-bold'
    },
    {
      title: 'Tier 3 Sponsors',
      sponsors: [
        {
          id: 1,
          name: 'Vortex Games',
          href: 'https://vortexgames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement',
          logo: 'https://cdn.snapcaster.ca/supporters/vortex_supporter.png'
        }
      ],
      cardClassName:
        'overflow-hidden border-2 border-primary/20 transition-all duration-200 hover:border-primary/50 hover:shadow-md',
      titleClassName: 'text-base font-bold'
    }
  ];

  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Separator className="mr-4 w-12" />
        <h2 className="text-center text-3xl font-bold">Our Sponsors</h2>
        <Separator className="ml-4 w-12" />
      </div>

      <div className="mb-8 text-center">
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          These amazing partners help make Snapcaster possible. Please support
          them as they support the Canadian MTG community.
        </p>
      </div>

      <div className="space-y-16">
        {sponsorTiers.map((tier, index) => (
          <div key={index} className="mb-12">
            <div className="mb-8 flex items-center justify-center">
              <Separator className="mr-4 w-8" />
              <h3 className="text-center text-2xl font-bold">{tier.title}</h3>
              <Separator className="ml-4 w-8" />
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {tier.sponsors.map((sponsor) => (
                <Card key={sponsor.id} className={tier.cardClassName}>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 h-[200px] w-full rounded-md bg-neutral-600 p-4 dark:bg-muted">
                      <a
                        href={sponsor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block h-full w-full"
                      >
                        <Image
                          src={sponsor.logo || '/placeholder.svg'}
                          alt={`${sponsor.name} logo`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: 'contain' }}
                        />
                      </a>
                    </div>
                    <h3
                      className={`mb-2 ${
                        tier.titleClassName || 'text-lg font-bold'
                      }`}
                    >
                      {sponsor.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
