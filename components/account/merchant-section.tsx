'use client';

import type React from 'react';

import { useState } from 'react';
import { CreditCard, DollarSign, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export function MerchantSection() {
  const { toast } = useToast();
  const [storeName, setStoreName] = useState('My Store');
  const [currency, setCurrency] = useState('USD');
  const [enablePayments, setEnablePayments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Merchant settings updated',
        description: 'Your merchant settings have been saved successfully.'
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Merchant Settings</CardTitle>
        <CardDescription>
          Configure your store and payment settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Store Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your store details and preferences.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter your store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Payment Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive payments from customers.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="enablePayments"
                  className="flex flex-col space-y-1"
                >
                  <span>Enable Payments</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Allow customers to make payments to your store.
                  </span>
                </Label>
                <Switch
                  id="enablePayments"
                  checked={enablePayments}
                  onCheckedChange={setEnablePayments}
                />
              </div>

              {enablePayments && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Connect your payment processor in the integrations section
                      to start accepting payments.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end px-0 pt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
