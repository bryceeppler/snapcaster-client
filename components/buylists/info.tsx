import useBuyListStore from "@/stores/buyListStore";
import { ArrowRight, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FC } from "react";
import useAuthStore from "@/stores/authStore";
import SearchBar from "../search-ui/search-bar";
import { Badge } from "../ui/badge";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const Info: FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const {
    tcg,
    searchTerm,
    setTcg,
    setSearchTerm,
    clearSearchResults,
    fetchCards,
    clearFilters,
    isLoading,
    setIsLoading,
    setCurrentPage
  } = useBuyListStore();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-background/80 py-20">
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Sell Your Cards
            </h1>
            <p className="font-montserrat mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
              Ship your cards for quick cash
              or store credit.
            </p>

            {!isAuthenticated ? (
              <Button
                size="lg"
                className="mt-8"
                onClick={() => {
                  const currentPath = router.asPath;
                  router.push(
                    `/signin?redirect=${encodeURIComponent(currentPath)}`
                  );
                }}
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex w-full justify-center mt-8">
                  <SearchBar
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    searchTool="buylists"
                    tcg={tcg}
                    searchTerm={searchTerm}
                    setTcg={setTcg}
                    setSearchTerm={setSearchTerm}
                    clearSearchResults={clearSearchResults}
                    fetchCards={fetchCards}
                    clearFilters={clearFilters}
                    setCurrentPage={setCurrentPage}
                  />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Get Cash or Credit in 5 Easy Steps
          </h2>
          <div className="mt-16 space-y-16">
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
  imageUrl?: string;
  isReversed?: boolean;
  imageStyle?: "default" | "bordered";
};

const StepCard = ({
  step,
  title,
  description,
  steps,
  imageUrl,
  isReversed = false,
  imageStyle = "default",
}: StepCardProps) => {
  return (
    <div
      className={cn(
        "grid gap-12 rounded-2xl border bg-card p-8 shadow-sm",
        imageUrl ? "lg:grid-cols-2" : "grid-cols-1",
        isReversed && imageUrl && "lg:[grid-template-areas:'content_image']"
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="h-8 w-fit rounded-full px-4 text-sm font-medium"
          >
            Step {step}
          </Badge>
          <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
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
              <AccordionContent className="text-muted-foreground">
                <p className="whitespace-pre-line pl-8">{item.description}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {imageUrl && (
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl",
            isReversed && "lg:order-first"
          )}
        >
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "max-h-[400px] w-auto mx-auto",
              imageStyle === "bordered" && "border-2 border-border shadow-lg rounded-xl"
            )}
            loading={step === 1 ? "eager" : "lazy"}
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
  imageStyle?: "default" | "bordered";
};

const steps: Step[] = [
  {
    title: "Build Your Sell List",
    description: "Create a list of cards you want to sell",
    steps: [
      {
        header: "Create a List",
        description: "Create up to 10 unique sell lists.",
      },
      {
        header: "Add Your Cards",
        description: "Search for cards across multiple TCGs and add them to your list.",
      },
    ],
    imageUrl: "https://cdn.snapcaster.ca/images/search.png",
    imageStyle: "bordered"
  },
  {
    title: "Review Your Offers",
    description: "View all offers from our supported game stores",
    steps: [
      {
        header: "Cash or Store Credit",
        description:
          "View detailed breakdowns of cash and credit offers across all stores on the review page.",
      },
      {
        header: "Best Cash and Credit Badge",
        description:
          "Keep an eye out for the best price badge on individual cards in the review breakdown.",
      },
    ],
    imageUrl:
      "https://cdn.snapcaster.ca/images/offers.png",
    imageStyle: "bordered"
  },
  {
    title: "Snapcaster Chrome Extension",
    description:
      "Connect your LGS online account to Snapcaster",
    steps: [
      {
        header: "Download the Snapcaster Extension",
        description:
          "On the review page you will be prompted to download the Snapcaster extension.",
      },
      {
        header: "Connect Your Game Store Account",
        description:
          "After linking your game store account using the Snapcaster extension, you can submit your quotes from any device.",
      },
      {
        header: "FAQ",
        description: `How do I use the Snapcaster Extension?

1. Click the puzzle Icon in the top right corner of your screen and select the Snapcaster Extension.

2. Sign in with your Snapcaster account and click the connect button of your desired store.

3. Create/Sign into an account on the LGS website and click the connect button in the extension.

4. Refresh the buylist page on Snapcaster and submit your quote.`,
      },
    ],

  },
  {
    title: "Submit Your Offer",
    description:
      "Review the final cash and credit breakdown and submit your offer",
    steps: [
      {
        header: "Submit Your Offer",
        description:
          "Ensure you entered your card list correctly and submit your offer. Store credit is automatically applied to the account you registered and connected on the LGS website.",
      },
      {
        header: "Await Your Confirmation Email",
        description:
          "Please allow a few business days for your LGS to send a finalized offer to the email you registered on their website.",
      },
    ],
    imageUrl:
      "https://cdn.snapcaster.ca/images/review.png",
    imageStyle: "bordered"
  },
  {
    title: "Send Your Cards",
    description:
      "Drop off or ship your cards to the game store after confirmation",
    steps: [
      {
        header: "Ship Your Cards",
        description:
          "You the seller are responsible for the shipping label, tracking, and insurance if you are shipping your cards. We highly reccomend shipping insurance on high value submissions.\n\nPlease sleeve and pack your cards in the order they are listed in your confirmation email. Damaged cards from poor packing may result in a lower offer.",
      },
      {
        header: "Get Paid",
        description:
          "Once the game store has received your cards, you will receive a confirmation email with your payment details.",
      },
      {
        header: "Reasons Why Your Offer May Be Adjusted",
        description: `1. The condition of your cards may not be what you entered.

2. Cards from new sets tend to be very volatile and are likely to be adjusted in the first few weeks of release.

3. Changes to demand such as store supply or updates to competiive rulings.

4. Fake cards will be seized and will be omitted from your offer.`,
      },
    ],
    imageUrl:
      "https://cdn.snapcaster.ca/images/catinbox.png",
  },
];

export default Info;
