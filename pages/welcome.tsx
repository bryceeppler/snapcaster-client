import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { motion } from 'motion/react';

import useGlobalStore from '@/stores/globalStore';
import { Integrations } from '@/components/welcome/integrations';
import Testimonials from '@/components/welcome/testimonials';
import { SignupForm } from '@/components/forms/SignupForm';
import { toast } from 'sonner';
import { CheckCircle, DollarSignIcon, GlobeIcon, MoveRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SolutionsGrid } from '@/components/welcome/solutions-grid';

type Props = {};

const Welcome = (props: Props) => {
  const { websites } = useGlobalStore();

  return (
    <>
      <div className="invisible h-2 w-full bg-primary sm:visible"></div>
      {/* Section 1 Hero */}
      <div className="bg-[#000315] lg:overflow-hidden lg:pb-14">
        <Header />
        {/* Hero content */}
        <div className="mx-auto max-w-7xl pb-4 md:pb-0 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-md px-6 sm:max-w-2xl sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
              <div className="flex flex-col gap-4 pb-8">
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                  <span className="block">Find the best prices </span>
                  <span className="block text-primary">
                    on trading cards in Canada
                  </span>
                </h1>
                <p className="lg:text-md text-lg text-gray-300">
                  Search the largest trading card database in Canada to find the
                  best deals across 80+ Canadian stores - for free! From Magic
                  the Gathering, Lorcana, Yu-Gi-Oh, Pokemon and more, we’ve got
                  you covered.
                </p>
                <div className="relative mt-4 flex w-full flex-col items-stretch justify-stretch gap-2 sm:justify-center md:flex-row lg:justify-start">
                  <Button
                    size="lg"
                    className="line-clamp-1 flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-primary/80"
                    onClick={() => {
                      window.open('/', '_blank');
                    }}
                  >
                    Search for Free
                  </Button>
                  <Button
                    onClick={() => {
                      window.open('/faq', '_blank');
                    }}
                    variant="ghost"
                    className="line-clamp-1 flex items-center justify-center gap-2 px-6 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-transparent hover:text-primary/80"
                    size="lg"
                  >
                    <span>FAQ</span> <MoveRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="-mb-16 mt-12 hidden sm:-mb-48 lg:relative lg:m-0 lg:block">
              <div className="mx-auto max-w-md px-6 text-white sm:max-w-2xl lg:max-w-none lg:px-0">
                <div className="relative flex h-[700px] w-[700px]">
                  <div className="z-10 block h-[700px] w-[700px]">
                    <div className="" style={{ width: '100%', height: '100%' }}>
                      <canvas
                        style={{
                          verticalAlign: 'top',
                          width: '700px',
                          height: '700px'
                        }}
                        width="1400"
                        height="1400"
                      ></canvas>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute left-[14px] flex h-[700px] w-[600px] items-center overflow-hidden"
                  >
                    <img
                      alt="Snapcaster Demo"
                      loading="lazy"
                      width="672"
                      height="500"
                      style={{ color: 'transparent' }}
                      src="/search-demo.png"
                      className="object-contain"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StoreSection />
      <RegisterSection />
      <ProblemSection />
      <SolutionSection />
      <TestimonialsSection />
      <TryNowSection />
      <Footer />
    </>
  );
};

const Header = () => {
  return (
    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
      <h1 className="flex flex-row items-center gap-2">
        <img src="/logo.png" alt="Snapcaster Logo" className="h-10 w-10" />
        <span className="cursor-pointer text-3xl font-bold tracking-tight text-white">
          snapcaster
        </span>
      </h1>
      <Button
        className="invisible md:visible"
        onClick={() => {
          window.open('/signin', '_blank');
        }}
      >
        Sign In
      </Button>
    </div>
  );
};

const StoreSection = () => {
  return (
    <div className="relative mx-auto flex flex-col items-center justify-center gap-32 bg-white px-4 pb-8 pt-16 sm:px-6 lg:px-8">
      <svg
        viewBox="0 0 1440 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        className="absolute top-0 bg-transparent"
      >
        <path
          d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
          fill="#000000"
        ></path>
      </svg>
      <div className="flex w-full max-w-5xl flex-col items-center justify-center pt-8 sm:pt-16">
        <div className="flex flex-col text-center">
          <h2 className="sm:text-md font-mono text-sm font-light text-primary">
            By Canadians. For Canadians.
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            We bring all the cards into one place, so you don’t have to.
          </p>
          <p className="text-md mx-auto mb-10 mt-5 max-w-prose text-gray-500 sm:text-lg">
            Supports 80+ Canadian retailers and counting.
          </p>
          <Integrations />
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <div className="relative mx-auto flex flex-col items-center justify-center gap-32 bg-white px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <svg
        viewBox="0 0 1440 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100%"
        className="absolute bottom-0 bg-transparent"
      >
        <path
          transform="rotate(180) translate(-1440, -60)"
          d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
          fill="#000315"
        ></path>
      </svg>

      <div className="justify-centermb-24 flex w-full max-w-5xl flex-col items-center">
        <div className="flex w-full flex-col text-center">
          <h2 className="mb-10 mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            See what people are saying.
          </h2>

          <Testimonials />
        </div>
      </div>
    </div>
  );
};

const SolutionSection = () => {
  return (
    <section id="solution">
      <div className="bg-secondary ">
        <div className="container relative mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto space-y-4 pb-6 text-center">
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
              Solution
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              Search across Canada, with one click. 
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Search once, search everywhere. Snapcaster allows you to search across 80+ Canadian vendors with one click. Find in-demand cards, at the best prices, while supporting local games stores.
            </p>
          </div>
          <SolutionsGrid />
        </div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <section id="problem" className="bg-white">
      <div>
        <div className="container relative mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto space-y-4 pb-6 text-center">
            <h2 className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
              Problem
            </h2>
            <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
              Buying cards is a hassle.
            </h3>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] will-change-auto">
              <div className="rounded-lg border border-none text-card-foreground shadow-none">
                <div className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <GlobeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Duties & Import Fees</h3>
                  <p className="text-muted-foreground">
                    Shopping for cards internationally means hidden import fees, duties, shipping costs and currency conversion. A card for $10 isn't <span className="italic">really</span> $10.
                  </p>
                </div>
              </div>
            </div>
            <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] will-change-auto">
              <div className="rounded-lg border border-none text-card-foreground shadow-none">
                <div className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-zap h-6 w-6 text-primary"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">
                    Finding Hot Cards 
                  </h3>
                  <p className="text-muted-foreground">
                    You want good cards, right? So does everyone else. Half the challenge is just finding them! 
                  </p>
                </div>
              </div>
            </div>
            <div className="opacity-1 filter-blur-0 transform-translate-y-[-6px] will-change-auto">
              <div className="rounded-lg border border-none text-card-foreground shadow-none">
                <div className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <DollarSignIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Inconsistent Prices 
                  </h3>
                  <p className="text-muted-foreground">
                    Have you ever noticed that some cards are just <span className="italic">more expensive</span> than others? Make sure you're not missing out on sales or opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RegisterSection = () => {
  const [accountCreated, setAccountCreated] = useState(false);
  return (
    <div className="relative mx-auto flex flex-col items-center justify-center gap-32 bg-secondary px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center">
        <div className="flex flex-col text-center">
          <h2 className="sm:text-md font-mono text-sm font-light text-primary">
            Join Today
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            The best part? It's free.
          </p>
          <p className="text-md mx-auto mt-5 max-w-prose text-gray-500 sm:text-lg">
            Sign up to get started.
          </p>

          <div className="mx-auto mt-10 w-full max-w-md text-left">
            <Card className="rounded bg-white p-4">
              <SignupForm
                confirmPassword={false}
                inputClassName="bg-white rounded"
                labels={'implicit'}
                showSignInLink={false}
                disableToast={true}
                onSuccess={() => {
                  setAccountCreated(true);
                  toast('Account created successfully!', {
                    duration: 8000,
                    action: {
                      label: 'Sign In',
                      onClick: () => {
                        window.open('/signin', '_blank');
                      }
                    }
                  });
                }}
              />
              {accountCreated && (
                <div className="mt-4 flex flex-row items-center gap-2">
                  {' '}
                  <CheckCircle className="h-4 w-4 text-primary" />{' '}
                  <p className="text-sm">
                    Account created successfully! You can now{' '}
                    <a href="/signin" className="text-primary">
                      sign in
                    </a>
                    .
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const TryNowSection = () => {
  return (
    <div className="relative mx-auto flex flex-col items-center justify-center gap-32 bg-[#000315] px-4 pb-48 pt-16 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center pt-8 sm:pt-16">
        <div className="flex flex-col gap-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
            <span className="block">Spend time building decks,</span>
            <span className="block text-primary">not searching for them.</span>
          </h1>
          <div className="mx-auto flex flex-row gap-4">
            <Button
              size="lg"
              className="line-clamp-1 flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-primary/80"
              onClick={() => {
                window.open('/', '_blank');
              }}
            >
              Search for Free
            </Button>
            <Button
              onClick={() => {
                window.open('/faq', '_blank');
              }}
              variant="ghost"
              className="line-clamp-1 flex items-center justify-center gap-2 px-6 py-3 text-center text-base font-bold text-white shadow-sm hover:bg-transparent hover:text-primary/80"
              size="lg"
            >
              <span>FAQ</span> <MoveRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#000315]">
      <div className="flex md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 border-t border-slate-400/10 px-4 py-6 sm:px-6 lg:px-8">
          <nav className="text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-secondary hover:text-primary"
                href="/terms"
              >
                Terms of Service
              </a>
              <a
                className="inline-block rounded-lg px-2 py-1 text-sm text-secondary hover:text-primary"
                href="/privacy"
              >
                Privacy Policy
              </a>
            </div>
          </nav>
          <div className="flex gap-x-6 text-gray-400">
            <a
              className="group"
              aria-label="Snapcaster Discord"
              href="https://discord.gg/EnKKHxSq75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"></path>
              </svg>
            </a>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Snapcaster. All rights reserved.
          </p>
        </div>
      </div>
      <div className="hidden md:flex">
        <div className="mx-auto flex w-full max-w-7xl flex-row justify-between border-t border-slate-400/10 px-4 py-6 text-gray-400 sm:px-6 lg:px-8">
          <div className="float-left flex">
            <p className="text-sm text-gray-400">
              © 2024 Snapcaster. All rights reserved.
            </p>
          </div>
          <div className="-ml-32 flex text-center">
            <nav className="text-sm" aria-label="quick links">
              <div className="-my-1 flex justify-center gap-x-6">
                <a
                  className="inline-block rounded-lg px-2 py-1 text-sm text-secondary hover:text-primary"
                  href="/terms"
                >
                  Terms of Service
                </a>
                <a
                  className="inline-block rounded-lg px-2 py-1 text-sm text-secondary hover:text-primary"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </div>
            </nav>
          </div>
          <div className="float-right flex">
            <div className="flex gap-x-6 text-gray-400">
              <a
                className="group"
                aria-label="Snapcaster Discord"
                href="https://discord.gg/EnKKHxSq75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Welcome;
