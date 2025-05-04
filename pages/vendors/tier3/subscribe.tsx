import { useAuth } from '@/hooks/useAuth';
import Signin from '@/pages/signin';
import { paymentService, SubscriptionType } from '@/services/paymentService';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useVendors } from '@/hooks/queries/useVendors';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  CheckIcon,
  InfoCircledIcon,
  LightningBoltIcon
} from '@radix-ui/react-icons';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const Subscribe = () => {
  const { isAuthenticated } = useAuth();
  const { vendors } = useVendors();
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    SubscriptionType.TIER_3_MONTHLY
  );
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pricing = {
    [SubscriptionType.TIER_3_MONTHLY]: 350,
    [SubscriptionType.TIER_3_QUARTERLY]: 290
  };

  const tier3Features = [
    'Full access to Snapcaster Analytics platform',
    'In-feed advertising',
    'Branding on search results',
    'Manage your discount codes',
    '1200+ subscriber email newsletter promotions',
    'Snapcaster buylist integration',
    'Express multi-search checkout'
  ];

  const handleOpenConfirmDialog = () => {
    if (!selectedVendor) {
      alert('Please select a vendor before subscribing');
      return;
    }
    setIsConfirmDialogOpen(true);
  };

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      const session = await paymentService.createCheckoutSession(
        subscriptionType
      );

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert(
        'There was an error processing your subscription. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Get the selected vendor name for display in confirmation dialog
  const selectedVendorName = selectedVendor
    ? vendors.find((v) => v.id.toString() === selectedVendor)?.name ||
      'Unknown vendor'
    : '';

  if (!isAuthenticated) {
    // TODO: Make sure we redirect to the subscribe page after signin
    return <Signin />;
  }

  return (
    <>
      <div className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/60 opacity-80" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          {/* Page Header with improved typography and spacing */}
          <div className="mb-10 text-center sm:mb-16">
            <Badge
              variant="outline"
              className="mb-3 border-primary/40 px-3 py-1.5 text-sm font-medium text-primary"
            >
              Vendor Subscription
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Snapcaster Tier 3
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Get full access to our premium inventory management tools and join
              our network of top MTG vendors
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Plan Selection Cards - Improved visual styling */}
            <div className="order-2 space-y-8 md:order-1 lg:col-span-2">
              {/* Step 1: Vendor Selection - Clearer section with visual indicator */}
              <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Select Your Vendor
                  </h2>
                </div>
                <div className="relative pt-2">
                  <Label htmlFor="vendor-selection" className="mb-2 block">
                    Vendor
                  </Label>
                  <Select
                    value={selectedVendor}
                    onValueChange={setSelectedVendor}
                  >
                    <SelectTrigger
                      className="w-full bg-background transition-all hover:border-primary/50 focus:border-primary"
                      id="vendor-selection"
                    >
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem
                          key={vendor.id}
                          value={vendor.id.toString()}
                        >
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="mt-3 text-sm text-muted-foreground">
                    You must be an employee of the selected vendor to subscribe.
                    Our team will verify your vendor association.
                  </p>
                </div>
              </div>

              {/* Step 2: Plan Selection - Enhanced visual design */}
              <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Choose Your Plan
                  </h2>
                </div>

                {/* Subscription Duration Cards with enhanced visual appeal */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {/* Monthly Plan Card - Improved styling and interaction */}
                  <div
                    onClick={() =>
                      setSubscriptionType(SubscriptionType.TIER_3_MONTHLY)
                    }
                    className={cn(
                      'group cursor-pointer overflow-hidden rounded-xl border-2 p-5 shadow-sm transition-all duration-300',
                      subscriptionType === SubscriptionType.TIER_3_MONTHLY
                        ? 'border-primary bg-primary/5 shadow-primary/20'
                        : 'border-transparent bg-card hover:border-primary/30 hover:bg-background/80'
                    )}
                  >
                    <div className="mb-4 flex justify-between">
                      <div>
                        <h3 className="font-medium">Monthly</h3>
                        <div className="flex items-baseline">
                          <p className="text-3xl font-bold">
                            ${pricing[SubscriptionType.TIER_3_MONTHLY]}
                          </p>
                          <span className="ml-1 text-sm text-muted-foreground">
                            /mo
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                          subscriptionType === SubscriptionType.TIER_3_MONTHLY
                            ? 'border-primary bg-primary text-white'
                            : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
                        )}
                      >
                        {subscriptionType ===
                          SubscriptionType.TIER_3_MONTHLY && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Flexible option with no long-term commitment</p>
                      <p className="font-medium text-muted-foreground">
                        Billed monthly
                      </p>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <CheckIcon className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Cancel anytime
                      </div>
                    </div>
                  </div>

                  {/* Quarterly Plan Card - Enhanced with better visual hierarchy */}
                  <div
                    onClick={() =>
                      setSubscriptionType(SubscriptionType.TIER_3_QUARTERLY)
                    }
                    className={cn(
                      'group relative cursor-pointer overflow-hidden rounded-xl border-2 p-5 shadow-sm transition-all duration-300',
                      subscriptionType === SubscriptionType.TIER_3_QUARTERLY
                        ? 'border-primary bg-primary/5 shadow-primary/20'
                        : 'border-transparent bg-card hover:border-primary/30 hover:bg-background/80'
                    )}
                  >
                    <div className="absolute -right-12 -top-12 rotate-45 bg-primary px-12 py-1.5 text-xs font-medium text-primary-foreground shadow-sm">
                      BEST VALUE
                    </div>
                    <div className="mb-1">
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                        SAVE 17%
                      </Badge>
                    </div>
                    <div className="mb-4 flex justify-between">
                      <div>
                        <h3 className="font-medium">Quarterly</h3>
                        <div className="flex items-baseline">
                          <p className="text-3xl font-bold">
                            ${pricing[SubscriptionType.TIER_3_QUARTERLY]}
                          </p>
                          <span className="ml-1 text-sm text-muted-foreground">
                            /mo
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200',
                          subscriptionType === SubscriptionType.TIER_3_QUARTERLY
                            ? 'border-primary bg-primary text-white'
                            : 'border-muted-foreground/30 bg-background group-hover:border-primary/50'
                        )}
                      >
                        {subscriptionType ===
                          SubscriptionType.TIER_3_QUARTERLY && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Our most popular plan with best value</p>
                      <p className="font-medium text-muted-foreground">
                        Billed ${pricing[SubscriptionType.TIER_3_QUARTERLY] * 3}{' '}
                        quarterly
                      </p>
                      <div className="mt-4 flex items-center text-xs text-muted-foreground">
                        <CheckIcon className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        3-month commitment
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Summary & Subscribe Button - Improved styling */}
              <div className="rounded-xl border bg-card p-6 shadow-sm md:hidden">
                <h3 className="mb-3 font-medium">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium">
                      {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                        ? 'Monthly'
                        : 'Quarterly'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">
                      $
                      {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                        ? pricing[SubscriptionType.TIER_3_MONTHLY]
                        : pricing[SubscriptionType.TIER_3_QUARTERLY]}
                      /mo
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>
                      $
                      {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                        ? pricing[SubscriptionType.TIER_3_MONTHLY]
                        : pricing[SubscriptionType.TIER_3_QUARTERLY] * 3}
                      {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                        ? '/month'
                        : ' every 3 months'}
                    </span>
                  </div>
                </div>
                <Button
                  className="mt-5 w-full"
                  size="lg"
                  onClick={handleOpenConfirmDialog}
                  disabled={!selectedVendor || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Subscribe Now'}
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  By subscribing, you agree to our{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Features and Checkout Card - Enhanced visual styling */}
            <div className="order-1 md:order-2">
              <div className="sticky top-4 space-y-6">
                {/* Features Card - Modern design with better spacing */}
                <Card className="overflow-hidden border-primary/10 shadow-lg backdrop-blur-sm">
                  <div className="absolute -left-12 -top-12 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
                  <CardHeader className="relative pb-2">
                    <div className="flex items-center gap-2">
                      <LightningBoltIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl font-bold sm:text-2xl">
                        Tier 3 Benefits
                      </CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      Everything you need to excel in the Canadian TCG market
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6 pt-4">
                    <Alert className="border-primary/20 bg-primary/5">
                      <InfoCircledIcon className="h-4 w-4 text-primary" />
                      <AlertTitle>Tier 3 Benefits</AlertTitle>
                      <AlertDescription className="text-sm">
                        Tier 3 subscriptions provide vendors with exclusive
                        tools and features designed to boost sales, exposure and
                        customer engagement.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h3 className="font-medium">Includes:</h3>
                      <ul className="space-y-4">
                        {tier3Features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary & Checkout - Enhanced visual presentation */}
                <Card className="hidden border-primary/10 shadow-lg backdrop-blur-sm md:block">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium">
                          {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                            ? 'Monthly'
                            : 'Quarterly'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          $
                          {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                            ? pricing[SubscriptionType.TIER_3_MONTHLY]
                            : pricing[SubscriptionType.TIER_3_QUARTERLY]}
                          /mo
                        </span>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>
                          $
                          {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                            ? pricing[SubscriptionType.TIER_3_MONTHLY]
                            : pricing[SubscriptionType.TIER_3_QUARTERLY] * 3}
                          {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                            ? '/month'
                            : ' every 3 months'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4 pt-2">
                    <Button
                      className="w-full transition-all duration-300 hover:brightness-105"
                      size="lg"
                      onClick={handleOpenConfirmDialog}
                      disabled={!selectedVendor || isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Subscribe Now'}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      By subscribing, you agree to our{' '}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                      .
                    </p>
                  </CardFooter>
                </Card>

                {/* Help Box - Better styling and contrast */}
                <div className="hidden rounded-xl border border-primary/10 bg-card p-5 shadow-md md:block">
                  <h3 className="mb-2 text-sm font-medium">
                    Need help getting started?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is available to help you set up your vendor account
                    and get the most out of your subscription. Contact support
                    at{' '}
                    <a
                      href="mailto:info@snapcaster.gg"
                      className="text-primary transition-colors duration-200 hover:text-primary/80 hover:underline"
                    >
                      info@snapcaster.gg
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog - Enhanced styling */}
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent className="border-primary/10 shadow-lg sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Confirm Your Subscription
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 text-sm">
              You are about to subscribe to the{' '}
              <span className="font-medium text-foreground">
                {subscriptionType === SubscriptionType.TIER_3_MONTHLY
                  ? 'Monthly'
                  : 'Quarterly'}{' '}
                Tier 3 plan
              </span>{' '}
              for{' '}
              <span className="font-medium text-foreground">
                {selectedVendorName}
              </span>
              .
              {subscriptionType === SubscriptionType.TIER_3_MONTHLY ? (
                <div className="mt-4 rounded-lg bg-primary/5 p-3 text-foreground">
                  You will be charged{' '}
                  <strong className="font-medium text-primary">
                    ${pricing[SubscriptionType.TIER_3_MONTHLY]}
                  </strong>{' '}
                  per month until you cancel.
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-primary/5 p-3 text-foreground">
                  You will be charged{' '}
                  <strong className="font-medium text-primary">
                    ${pricing[SubscriptionType.TIER_3_QUARTERLY] * 3}
                  </strong>{' '}
                  every 3 months with a 3-month minimum commitment.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 gap-2 sm:gap-0">
            <AlertDialogCancel disabled={isProcessing} className="mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={cn(
                'bg-primary hover:bg-primary/90',
                isProcessing ? 'cursor-not-allowed opacity-70' : ''
              )}
            >
              {isProcessing ? 'Processing...' : 'Continue to Checkout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Subscribe;
