import { CheckCircle } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Component() {
  return (
    <>
      <FaqHead />
      <section className="w-full space-y-4 py-3 md:py-6 lg:py-12">
        <div className="mx-auto space-y-2">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
              General FAQ
            </h1>
          </div>
          <Accordion type="single" collapsible className="grid gap-4">
            <AccordionItem value="what-is-this">
              <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3  text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                What is Snapcaster?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                Snapcaster is Canada's premier search engine for collectible TCG
                cards, including Pokémon, Magic: The Gathering, Yu-Gi-Oh and
                more. Our platform allows you to search across more than 90
                Canadian online retailers to find the best deals and build the
                decks of your dreams.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-it-works">
              <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background  px-4 py-3 text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                How does Snapcaster work?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                Snapcaster works by aggregating listings from various Canadian
                online retailers into one easy-to-use platform. When you search
                for a card, Snapcaster quickly scans its vast database to show
                you the best prices and deals available.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-often-is-snapcaster-updated">
              <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background  px-4 py-3 text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                When are singles and sealed products updated?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                Our singles and sealed product are updated two times a day.
                LGS's typically update their prices two times a day based on TCG
                Player pricing so you may find minor discrepancies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact">
              <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background  px-4 py-3 text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                I still have questions, who can I contact?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                If you have any further questions, feel free to reach out to us
                in our Discord community.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mx-auto space-y-2">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl">
              LGS FAQ
            </h1>
          </div>
          <Accordion type="single" collapsible className="grid gap-4">
            <AccordionItem value="add-store">
              <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background  px-4 py-3 text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                Can you add a store to Snapcaster?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                <div>
                  <p>
                    Absolutely! please have your LGS owners fill our{' '}
                    <Link
                      href="https://docs.google.com/forms/d/161NAY_EZrQ64CKiMmU4LnxTrj37mfiA8hoDkB_pZdok/edit"
                      target="_none"
                      className="text-blue-500"
                    >
                      Google form
                    </Link>{' '}
                    and reach out to us at either info@snapcaster.gg or Discord.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advertising">
              <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                What advertising, analytics, and exclusive features are
                available?
              </AccordionTrigger>
              <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                You can learn more about our tier 3 packages{' '}
                <Link
                  href="/vendors/tier3"
                  className="text-blue-500"
                  target="_none"
                >
                  here
                </Link>
                .
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <section className="">
          <div className=" space-y-4">
            <h1
              id="buylists"
              className="scroll-mt-16 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:scroll-mt-32 md:text-4xl"
            >
              Buylist FAQ
            </h1>

            <div className="mx-auto space-y-2">
              <Accordion type="single" collapsible className="grid gap-4">
                <AccordionItem value="how-buylists-work">
                  <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background  px-4 py-3 text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                    How does Snapcaster buylists work?
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                    <div>
                      <p>
                        Log in to your account, create a list of cards you'd
                        like to sell for cash or credit, and submit your offer
                        directly to one of our partnered game stores through
                        Snapcaster.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="what-stores-are-supported">
                  <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                    How many stores are supported?
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                    Snapcaster's aggregated buylist program is currently
                    available to vendors who are Tier 3 sponsors or higher. You
                    can view the complete list of participating stores{' '}
                    <Link
                      href="/about"
                      target="_none"
                      className="text-blue-500"
                    >
                      here
                    </Link>{' '}
                    .
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="what-games-are-supported">
                  <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                    What card games are supported?
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                    While not every store supports every game, all major TCGs
                    are supported across the platform. This includes Magic: The
                    Gathering (MTG), Pokémon, Yu-Gi-Oh!, Lorcana, One Piece TCG,
                    Flesh and Blood (FAB), and Star Wars Unlimited (SWU).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="buylists-prices-updated">
                  <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                    How often are cash and credit prices updated?
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                    Store cash/credit rates and purchase limits are updated
                    daily. Buylist prices are automatically adjusted based on
                    current TCGPlayer pricing, which may result in a slight
                    difference in your final offer. Final adjusted offers are
                    typically sent within a few business days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  id="right-of-cancellation"
                  value="right-of-cancellation"
                  className="scroll-mt-16 md:scroll-mt-32"
                >
                  <AccordionTrigger className="flex items-center justify-between  rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover md:text-base">
                    Your right of cancellation
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                    Submitting a buylist is simply an offer request—you're under
                    no obligation to accept or ship your cards. If you choose
                    not to proceed after receiving your final offer by email,
                    please notify the store directly.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className=" space-y-4">
              {steps.map((step, index) => (
                <StepCard
                  key={index}
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  steps={step.steps}
                  imageUrl={step.imageUrl}
                  isReversed={index % 2 !== 0}
                  imageStyle={step.imageStyle}
                />
              ))}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  steps: Array<{
    header: string;
    description: string;
  }>;
  imageUrl: string | undefined;
  isReversed: boolean;
  imageStyle: 'default' | 'bordered' | undefined;
};

const StepCard = ({
  step,
  title,
  description,
  steps,
  imageUrl,
  isReversed = false,
  imageStyle = 'default'
}: StepCardProps) => {
  return (
    <div
      className={cn(
        'grid gap-4 rounded-xl border bg-card p-8 shadow-sm',
        imageUrl ? 'lg:grid-cols-2' : 'grid-cols-1',
        isReversed && imageUrl && "lg:[grid-template-areas:'content_image']"
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="h-8 w-fit rounded-full px-4 text-sm font-medium"
          >
            Step {step}
          </Badge>
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h3>
          <p className="text-base leading-none text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>

        <Accordion type="multiple" className="w-full">
          {steps.map((item, index) => (
            <AccordionItem
              key={index}
              value={index.toString()}
              className="border-b border-border/50 last:border-b-0"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{item.header}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground ">
                <p className="whitespace-pre-line px-2">{item.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {imageUrl && (
        <div
          className={cn(
            'relative w-full overflow-hidden rounded-xl',
            isReversed && 'lg:order-first'
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              'mx-auto max-h-[400px] w-auto',
              imageStyle === 'bordered' &&
                'rounded-xl border-2 border-border shadow-lg'
            )}
            loading={step === 1 ? 'eager' : 'lazy'}
          />
        </div>
      )}
    </div>
  );
};

type Step = {
  title: string;
  description: string;
  steps: Array<{
    header: string;
    description: string;
  }>;
  imageUrl?: string;
  imageStyle?: 'default' | 'bordered';
};

const steps: Step[] = [
  {
    title: 'Build Your  List',
    description: 'Create a list of cards you want to sell',
    steps: [
      {
        header: 'Create a List',
        description:
          'Create up to 10 unique sell lists to organize your card sales.'
      },
      {
        header: 'Add Your Cards',
        description:
          'Search across multiple TCGs and easily add cards to your sell lists.'
      }
    ],
    imageUrl: '/buylists-create-list.PNG',
    imageStyle: 'bordered'
  },
  {
    title: 'Review Your Offers',
    description: 'View all offers from our supported game stores',
    steps: [
      {
        header: 'Cash or Store Credit',
        description:
          'On the review page, view a detailed breakdown of cash and credit offers from all participating stores.'
      },
      {
        header: 'Best Cash and Credit Badge',
        description:
          'Look for the "Best Price" badge to spot top offers for individual cards.'
      }
    ],
    imageUrl: '/buylists-review-offers.PNG',
    imageStyle: 'bordered'
  },
  {
    title: 'Snapcaster Chrome Extension',
    description: 'Connect your LGS online account to Snapcaster',
    steps: [
      {
        header: 'Download the Snapcaster Extension',
        description:
          "When you reach the store offers page, you'll be prompted to download the Snapcaster extension."
      },
      {
        header: 'Connect Your Game Store Account',
        description:
          'Once your game store account is linked via the Snapcaster extension, you can submit offers from any device.'
      },
      {
        header: 'FAQ',
        description: `How do I use the Snapcaster Extension?

1. Click the puzzle Icon in the top right corner of your screen and select the Snapcaster Extension.

2. Sign in with your Snapcaster account and click the connect button of your desired store.

3. Create/Sign into an account on the LGS website and click the connect button in the extension.

4. Refresh the buylist page on Snapcaster and submit your quote.`
      }
    ]
  },
  {
    title: 'Submit Your Offer',
    description:
      'Review the final cash and credit breakdown and submit your offer',
    steps: [
      {
        header: 'Submit Your Offer',
        description:
          'Double-check your card list for accuracy before submitting your offer. Store credit will be automatically applied to the account you registered and connected on the LGS website.'
      },
      {
        header: 'Await Your Confirmation Email',
        description:
          'Please allow a few business days for your LGS to send a finalized offer to the email you registered on their website.'
      }
    ],
    imageUrl: '/buylists-submit-offer.PNG',
    imageStyle: 'bordered'
  },
  {
    title: 'Send Your Cards',
    description:
      'Drop off in person or ship your cards to the game store after confirmation',
    steps: [
      {
        header: 'Ship Your Cards',
        description:
          'As the seller, you are responsible for providing the shipping label, tracking, and insurance. We strongly recommend insuring high-value submissions.\n\nPack your cards in the exact order shown in your confirmation email. Improper packaging or damage during transit may result in a reduced offer.'
      },
      {
        header: 'Get Paid',
        description:
          "Once the game store receives your cards, you'll get a confirmation email with your payment details."
      },
      {
        header: 'Reasons Why Your Offer May Be Adjusted',
        description: `1. The condition of your cards may not be what you entered.

2. Cards from new sets tend to be very volatile and are likely to be adjusted in the first few weeks of release.

3. Changes to demand such as store supply or updates to competiive rulings.

4. Fake cards will be seized and will be omitted from your offer.`
      }
    ]
  }
];

const FaqHead = () => {
  return (
    <Head>
      <title>Snapcaster</title>
      <meta
        name="description"
        content="Search Magic the Gathering cards across Canada"
      />
      <meta
        property="og:title"
        content={`Snapcaster - Search Magic the Gathering cards across Canada`}
      />
      <meta
        property="og:description"
        content={`Find Magic the Gathering singles and sealed product using in Snapcaster. Search your favourite Canadian stores.`}
      />
      <meta property="og:url" content={`https://snapcaster.ca`} />
      <meta property="og:type" content="website" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
