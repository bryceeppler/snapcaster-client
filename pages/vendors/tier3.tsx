import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { motion } from 'motion/react';

import useGlobalStore from '@/stores/globalStore';
import { Integrations } from '@/components/welcome/integrations';
import Testimonials from '@/components/welcome/testimonials';
import { SignupForm } from '@/components/forms/SignupForm';
import { toast } from 'sonner';
import {
  CheckCircle,
  DollarSignIcon,
  GlobeIcon,
  MoveRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SolutionsGrid } from '@/components/welcome/solutions-grid';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';

type Props = {};

const Tier3 = (props: Props) => {
  const { websites } = useGlobalStore();
  const [accountCreated, setAccountCreated] = useState(false);
  return (
    <>
      <div className="invisible h-2 w-full bg-primary sm:visible"></div>
      {/* Section 1 Hero */}
      <div className="min-h-screen bg-[#000315] lg:overflow-hidden">
        <Header />
        {/* Hero content */}
        <div className="mx-auto h-48 max-w-7xl pb-4 md:pb-0 lg:px-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Snapcaster Partners
            </h1>
            <span className="text-2xl text-primary">Tier 3</span>
          </div>
        <div className="mx-auto max-w-7xl pb-4 md:pb-0 lg:px-8">

    <div className="relative">
      <HeroVideoDialog
        className="dark:hidden block max-w-[600px] mx-auto"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block max-w-[600px] mx-auto"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>

    

        </div>
      </div>
    </>
  );
};

const Header = () => {
  return (
    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
      <h1 className="flex flex-row items-end">
        <img src="/logo.png" alt="Snapcaster Logo" className="mr-2 h-10 w-10" />
        <span className="text-3xl font-bold tracking-tight text-white">
          snapcaster
        </span>
        <span className="text-3xl font-bold tracking-tight text-primary">
          partners
        </span>
      </h1>
    </div>
  );
};

export default Tier3;
