import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { Mail, Copy, Check } from 'lucide-react';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const ContactMethod = ({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action: React.ReactNode;
}) => (
  <Card>
    <CardContent className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action}
    </CardContent>
  </Card>
);

const EmailButton = () => {
  const [copied, setCopied] = useState(false);
  const email = 'info@snapcaster.gg';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full sm:w-fit" 
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {email}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copied to clipboard!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Contact: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contact - Snapcaster</title>
        <meta
          name="description"
          content="Get in touch with the Snapcaster team for support, feedback, or questions."
        />
        <meta
          property="og:title"
          content="Contact - Snapcaster"
        />
        <meta
          property="og:description"
          content="Get in touch with the Snapcaster team for support, feedback, or questions."
        />
        <meta property="og:url" content="https://snapcaster.ca/contact" />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
            <p className="text-muted-foreground">
              Have questions or feedback? We're here to help.
            </p>
          </div>

          <div className="mt-8 grid gap-6">
            <ContactMethod
              icon={DiscordLogoIcon}
              title="Join our Discord Community"
              description="Connect with other users and get direct support from the Snapcaster team. Our Discord server is the best place to stay updated and get help."
              action={
                <Button className="w-full sm:w-fit" asChild>
                  <a href="https://discord.gg/EnKKHxSq75" target="_blank" rel="noopener noreferrer">
                    <DiscordLogoIcon className="mr-2 h-4 w-4" />
                    Join Discord Server
                  </a>
                </Button>
              }
            />

            <ContactMethod
              icon={Mail}
              title="Email Support"
              description="For business inquiries, partnership opportunities, or if you prefer email communication, reach out to our support team."
              action={<EmailButton />}
            />
          </div>

          <div className="mt-8 rounded-lg border bg-card p-6">
            <h2 className="font-semibold">Response Times</h2>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground">
              <p>• Discord: Usually within a few hours</p>
              <p>• Email: Within 1-2 business days</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
