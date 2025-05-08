'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import type React from 'react';


import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function ProfileSection() {
  const { toast } = useToast();
  const { profile, resendVerificationEmail, isResendingVerification } =
    useAuth();

  const fullName = profile?.data?.user?.fullName || '';
  const email = profile?.data?.user?.email || '';
  const isVerified = profile?.data?.user?.emailVerified || false;

  const handleResendVerification = async () => {
    resendVerificationEmail(undefined, {
      onSuccess: () => {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your inbox for the verification link.'
        });
      },
      onError: (error) => {
        toast({
          title: 'Error sending verification email',
          description: error.message
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Profile</CardTitle>
        <CardDescription>
          Manage your personal information and how it appears on your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={fullName}
                placeholder="Enter your display name"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email address"
                disabled
              />
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                {isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Email Verification</h3>
                <p className="text-sm text-muted-foreground">
                  {isVerified
                    ? 'Your email has been verified.'
                    : 'Your email is not verified. Please verify your email to access all features.'}
                </p>
              </div>
              {!isVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                >
                  {isResendingVerification ? 'Sending...' : 'Resend'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
