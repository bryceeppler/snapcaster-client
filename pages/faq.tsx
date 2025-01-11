import Head from 'next/head';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';

export default function Component() {
  return (
    <>
      <FaqHead />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground">Some common questions...</p>
            </div>
            <Accordion type="single" collapsible className="grid gap-4">
              <AccordionItem value="what-is-this">
                <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover">
                  What is Snapcaster?
                </AccordionTrigger>
                <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                  Snapcaster is Canada's premier search engine for collectible
                  TCG cards, including Pokémon, Magic: The Gathering, Yu-Gi-Oh
                  and more. Our platform allows you to search across more than
                  65 Canadian online retailers to find the best deals and build
                  the decks of your dreams.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="how-it-works">
                <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover">
                  How does Snapcaster work?
                </AccordionTrigger>
                <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                  Snapcaster works by aggregating listings from various Canadian
                  online retailers into one easy-to-use platform. When you
                  search for a card, Snapcaster scans its extensive database and
                  displays the available options, helping you find the best
                  prices and deals. Our goal make your shopping easier, so you
                  can focus on building the perfect deck.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add-store">
                <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover">
                  Can you add a store to Snapcaster?
                </AccordionTrigger>
                <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                  Absolutely! If you have a Canadian online store that you would
                  like to see on Snapcaster, we'd love to hear from you. Join
                  our Discord community to stay updated, make suggestions, or
                  report any bugs. Your feedback helps us improve and expand our
                  platform.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="advertising">
                <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover">
                  How can I advertise my business on Snapcaster?
                </AccordionTrigger>
                <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                  If you're interested in our advertising program feel free to
                  reach out to @bryce on our Discord server or via email at
                  info@snapcaster.gg for more information.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contact">
                <AccordionTrigger className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 font-medium transition-colors hover:bg-popover data-[state=open]:bg-popover">
                  I still have questions, who can I contact?
                </AccordionTrigger>
                <AccordionContent className="bg-muted px-4 py-3 text-popover-foreground">
                  If you have any further questions, feel free to reach out to
                  us. You can contact us in our Discord community.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

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
