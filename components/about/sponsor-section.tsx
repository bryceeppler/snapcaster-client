'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { trackAdClick } from '@/utils/analytics';

interface SponsorCardProps {
  href: string;
  imgSrc: string;
  alt?: string;
  positionId?: string;
  adId?: string;
}

const SponsorCard = ({
  href,
  imgSrc,
  alt,
  positionId,
  adId
}: SponsorCardProps) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      boxShadow:
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    }}
    whileTap={{ scale: 0.98 }}
    className="group relative overflow-visible rounded-xl border border-transparent bg-zinc-800/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:z-10 hover:border-primary/20"
  >
    <Link
      href={href}
      target="_blank"
      data-position-id={positionId}
      data-ad-id={adId}
      onClick={() => adId && trackAdClick(adId)}
      className="block overflow-visible p-8"
    >
      <div className="relative aspect-[2/1] overflow-visible rounded-lg">
        <img
          alt={alt}
          className="absolute h-full w-full origin-center transform object-contain transition-transform duration-300 group-hover:scale-110 group-hover:brightness-110"
          src={imgSrc}
        />
      </div>
    </Link>
  </motion.div>
);

export default function SponsorSection() {
  return (
    <>
      {/* Tier 1 Sponsors */}
      <div className="space-y-8">
        <div className="flex flex-col items-center">
          <h3 className="text-center text-3xl font-bold">Tier 1 Sponsors</h3>
          <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* OBSIDIAN */}
          <SponsorCard
            href="https://obsidiangames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/obsidian_supporter.png"
            alt="Obsidian Games Vernon"
            positionId="6"
            adId="13"
          />
          {/* EXOR */}
          <SponsorCard
            href="https://exorgames.com?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/exorgames_supporter.png"
            alt="Exor Games"
            positionId="6"
            adId="44"
          />
          {/* CHIMERA */}
          <SponsorCard
            href="https://chimeragamingonline.com/?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/chimera_supporter.png"
            alt="Chimera Gaming"
            positionId="6"
            adId="43"
          />
        </div>
      </div>

      {/* Tier 2 Sponsors */}
      <div className="space-y-8">
        <div className="flex flex-col items-center">
          <h3 className="text-center text-3xl font-bold">Tier 2 Sponsors</h3>
          <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* LEVEL UP */}
          <SponsorCard
            href="https://levelupgames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/levelup_supporter.png"
            alt="Level Up Games"
            positionId="8"
            adId="42"
          />
          {/* The Mythic Store */}
          <SponsorCard
            href="https://themythicstore.com?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/tms_supporter.png"
            alt="The Mythic Store"
            positionId="8"
            adId="55"
          />
          {/* House of Cards */}
          <SponsorCard
            href="https://houseofcards.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/hoc_supporter.png"
            alt="House of Cards"
            positionId="8"
            adId="56"
          />
        </div>
      </div>

      {/* Tier 3 Sponsors */}
      <div className="space-y-8">
        <div className="flex flex-col items-center">
          <h3 className="text-center text-3xl font-bold">Tier 3 Sponsors</h3>
          <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-primary/40"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* VORTEX */}
          <SponsorCard
            href="https://vortexgames.ca?utm_source=sc&utm_medium=referral&utm_campaign=referral_advertisement"
            imgSrc="https://cdn.snapcaster.ca/supporters/vortex_supporter.png"
            alt="Vortex Games"
          />
        </div>
      </div>
    </>
  );
}
