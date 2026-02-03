'use client';

import { Check, CreditCard, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { paymentService } from '@/services/paymentService';

export function SubscriptionSection() {
  const { toast } = useToast();
  const { hasActiveSubscription } = useAuth();
  const isPro = hasActiveSubscription;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await paymentService.createCheckoutSession();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create checkout session'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManage = async () => {
    setIsLoading(true);
    try {
      await paymentService.createPortalSession();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to access billing portal'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="rounded-lg border">
            <div className="flex flex-col space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold">
                    {isPro ? 'Pro Membership' : 'Free Plan'}
                  </h3>
                  {isPro && (
                    <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Active
                    </div>
                  )}
                </div>
                {isPro && <p className="text-sm font-medium">$2.99/month</p>}
              </div>
              {!isPro && (
                <p className="mb-2 text-sm text-muted-foreground">
                  Upgrade to Pro for just $2.99/month and unlock all premium
                  features!
                </p>
              )}
              <div className="space-y-2">
                <div className="flex items-center">
                  {isPro ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    Multi search up to 100 cards at a time
                  </span>
                </div>
                <div className="flex items-center">
                  {isPro ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    Pro exclusive Discord giveaways
                  </span>
                </div>
                <div className="flex items-center">
                  {isPro ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <X className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Ad-free experience</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end border-t p-4">
              {isPro ? (
                <Button
                  variant="outline"
                  onClick={handleManage}
                  disabled={isLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Manage Subscription'}
                </Button>
              ) : (
                <Button onClick={handleSubscribe} disabled={isLoading}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Processing...' : 'Subscribe to Pro'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
