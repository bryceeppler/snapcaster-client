import useBuyListStore from '@/stores/buyListStore';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { FC } from 'react';
import useAuthStore from '@/stores/authStore';
import SearchBar from '../search-ui/search-bar';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/router';

interface ReviewProps {
  setCurrentStep: (step: any) => void;
}

const Info: FC<ReviewProps> = ({ setCurrentStep }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters
  } = useBuyListStore();
  return (
    <div>
      <div
        className={`grid min-h-[55svh] grid-cols-1 items-center justify-center gap-6 ${
          !isAuthenticated && 'md:grid-cols-1'
        }`}
      >
        {!isAuthenticated ? (
          <section className="col-span-1 flex w-full justify-center sm:px-32">
            <div className="flex flex-col items-center gap-3">
              <img
                className="crisp-edges mx-auto h-12 w-auto md:h-16"
                src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                alt="Snapcaster"
              />
              <h1 className="text-center text-2xl font-black sm:text-xl md:text-3xl">
                Submit Your Buylists All In One Place
              </h1>
              <p className="text-center text-base sm:text-sm md:text-base">
                Effortlessly{' '}
                <span className="font-bold text-primary">
                  Build, Submit, and Ship
                </span>{' '}
                your card list for quick cash or credit from top local game
                stores across Canada!
              </p>
              <Button
                className="mt-4 w-40"
                onClick={() => {
                  const currentPath = router.asPath;
                  router.push(
                    `/signin?redirect=${encodeURIComponent(currentPath)}`
                  );
                }}
              >
                Sign In To Start
              </Button>
              <div className="group mt-6 flex cursor-pointer flex-col items-center gap-1">
                <p className="text-center text-sm font-semibold md:text-base">
                  Get Cash or Credit in 5 Easy Steps
                </p>
                <ChevronDown className="transition-transform duration-300 group-hover:translate-y-1" />
              </div>
            </div>
          </section>
        ) : (
          <section className="col-span-1 flex w-full justify-center sm:px-32">
            <div className="flex flex-col items-center gap-3">
              <img
                className="crisp-edges mx-auto h-12 w-auto md:h-16"
                src="https://cdn.snapcaster.ca/snapcaster_logo.webp"
                alt="Snapcaster"
              />
              <h1 className="text-center text-2xl font-black sm:text-xl md:text-3xl">
                Submit Your Buylists All In One Place
              </h1>
              <p className="text-center text-base sm:text-sm md:text-base">
                Effortlessly{' '}
                <span className="font-bold text-primary">
                  Build, Submit, and Ship
                </span>{' '}
                your card list for quick cash or credit from top local game
                stores across Canada!
              </p>
              <SearchBar
                searchTool="buylists"
                tcg={tcg}
                searchTerm={searchTerm}
                setTcg={setTcg}
                setSearchTerm={setSearchTerm}
                clearSearchResults={clearSearchResults}
                fetchCards={fetchCards}
                clearFilters={clearFilters}
              />
              <div className="group mt-6 flex cursor-pointer flex-col items-center gap-1">
                <p className="text-center text-sm font-semibold md:text-base">
                  Get Cash or Credit in 5 Easy Steps
                </p>
                <ChevronDown className="transition-transform duration-300 group-hover:translate-y-1" />
              </div>
            </div>
          </section>
        )}
      </div>

      <StepCard
        step={1}
        title="Build Your Sell List"
        description="Create a list of cards you want to sell"
        steps={[
          {
            header: 'Create a List',
            description: 'Create up to 10 unique sell lists.'
          },
          {
            header: 'Add All Your Cards',
            description: 'Search and add all your cards into your list at once.'
          }
        ]}
        imageUrl="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
      />

      <StepCard
        step={2}
        title="Review Your Offers"
        description="View all offers from our supported game stores"
        steps={[
          {
            header: 'Cash or Store Credit',
            description:
              'View detailed breakdowns of cash and credit offers across all stores on the review page.'
          },
          {
            header: 'Best Cash and Credit Badge',
            description:
              'Keep an eye out for the best price badge on individual cards in the review breakdown.'
          }
        ]}
        imageUrl="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
      />

      <StepCard
        step={3}
        title="Snapcaster Chrome Extension"
        description="A one time connection from your LGS online account to Snapcaster"
        steps={[
          {
            header: 'Download the Snapcaster Extension',
            description:
              'On the review page you will be prompted to download the Snapcaster extension.'
          },
          {
            header: 'Connect Your Game Store Account',
            description: `After linking your game store account using the Snapcaster extension, you can submit your quotes from any device.`
          },
          {
            header: 'FAQ',
            description: `  How do I use the Snapcaster Extension?

                            1. Click the puzzle Icon in the top right corner of your screen and select the Snapcaster Extension.

                            2. Sign in with your Snapcaster account and click the connect button of your desired store.

                            3. Create/Sign into an account on the LGS website and click the connect button in the extension.

                            4. Refresh the buylist page on Snapcaster and submit your Quote.`
          }
        ]}
        imageUrl="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
      />

      <StepCard
        step={4}
        title="Submit Your Offer"
        description="Review the final cash and credit breakdown and submit your offer"
        steps={[
          {
            header: 'Submit Your Offer',
            description: `Ensure you entered your card list correctly and submit your offer.
              
              Store credit is automatically applied to the account you registered and connected on the LGS website.`
          },
          {
            header: 'Await Your Confirmation Email',
            description: `Please allow a few business days for your LGS to send a finalized offer to the email you registered on their website.`
          }
        ]}
        imageUrl="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
      />

      <StepCard
        step={5}
        title="Send Your Cards"
        description="Drop off or ship your cards to the game store after confirmation"
        steps={[
          {
            header: 'Ship Your Cards',
            description: `You the seller are responsible for the shipping label, tracking, and insurance if you are shipping your cards. We highly reccomend shipping insurance on high value submissions.
              
              Please sleeve and pack your cards in the order they are listed in your confirmation email. Damaged cards from poor packing may result in a lower offer.
              `
          },

          {
            header: 'Get Paid',
            description: `Once the game store has received your cards, you will receive a confirmation email with your payment details.`
          },

          {
            header: 'Reasons Why Your Offer May Be Adjusted',
            description: `1. The condition of your cards may not be what you entered.

                            2. Cards from new sets tend to be very volatile and are likely to be adjusted in the first few weeks of release.

                            3. Changes to demand such as store supply or updates to competiive rulings.

                            4. Fake cards will be seized and will be omitted from your offer.`
          }
        ]}
        imageUrl="https://hds.hel.fi/images/foundation/visual-assets/placeholders/image-l@3x.png"
      />
    </div>
  );
};

type StepCardProps = {
  step: number;
  title: string;
  description: string;
  steps: Array<{
    header: string;
    description: string;
  }>;
  imageUrl: string;
};

const StepCard = ({
  step,
  title,
  description,
  steps,
  imageUrl
}: StepCardProps) => {
  return (
    <div className="w-full py-2 lg:py-8">
      <div className="container mx-auto">
        <div className="container grid grid-cols-1 items-center gap-8 rounded-lg border p-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div>
                <Badge variant="outline">Step {step}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter lg:text-5xl">
                  {title}
                </h2>
                <p className="max-w-xl text-left text-lg font-semibold leading-relaxed tracking-tight text-primary">
                  {description}
                </p>
              </div>
            </div>
            <Accordion type="single" collapsible>
              {steps.map((step, index) => (
                <div key={index} className="flex flex-row items-start gap-3">
                  <div className="flex w-full flex-col gap-1">
                    <AccordionItem value={index.toString()}>
                      <AccordionTrigger className="hover:no-underline">
                        {index + 1}. {step.header}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-line text-sm leading-tight text-muted-foreground">
                          {step.description}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                </div>
              ))}{' '}
            </Accordion>
          </div>
          <div
            className="aspect-video w-full rounded-xl bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${imageUrl}")`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Info;
