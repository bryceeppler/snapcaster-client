import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Smartphone, Mail, Send, Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  redirectUrl?: string;
};

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInForm({ redirectUrl }: Props) {
  const {
    login,
    isLoggingIn,
    requiresTwoFactor,
    tempToken,
    availableMethods,
    completeTwoFactorLogin,
    isCompletingTwoFactorLogin,
    sendEmailVerificationCode,
    isSendingEmailCode
  } = useAuth();

  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('app');
  const [emailCodeSent, setEmailCodeSent] = useState(false);

  // If there's only one method available, automatically select it
  useEffect(() => {
    if (availableMethods.length === 1) {
      setSelectedMethod(availableMethods[0]);
    }
  }, [availableMethods]);

  // Reset emailCodeSent when method changes
  useEffect(() => {
    setEmailCodeSent(false);
  }, [selectedMethod]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>();

  const onSubmit = (data: SignInFormData) => {
    setError(null);
    login(data, {
      onError: (error) => {
        setError(error.message);
      }
    });
  };

  const handleTwoFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempToken) {
      setError('Session expired. Please try logging in again.');
      return;
    }

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    completeTwoFactorLogin(
      {
        tempToken,
        twoFactorCode,
        method: selectedMethod
      },
      {
        onSuccess: () => {
          setError(null);
        },
        onError: (error) => {
          setError(error.message);
        }
      }
    );
  };

  const handleSendEmailCode = () => {
    if (tempToken) {
      sendEmailVerificationCode(tempToken, {
        onSuccess: () => {
          setEmailCodeSent(true);
        },
        onError: () => {
          setError('Error sending verification code. Please try again.');
        }
      });
    } else {
      setError('Session expired. Please try logging in again.');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'app':
        return <Smartphone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'recovery':
        return <Key className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'app':
        return 'Authenticator App';
      case 'email':
        return 'Email';
      case 'recovery':
        return 'Recovery Code';
      default:
        return method;
    }
  };

  // Render the 2FA form if required
  if (requiresTwoFactor) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>Verify your identity to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {availableMethods.length > 1 && (
              <div className="space-y-2">
                <Label>Authentication Method</Label>
                <RadioGroup
                  value={selectedMethod}
                  onValueChange={setSelectedMethod}
                  className="flex flex-col space-y-2"
                >
                  {availableMethods.map((method) => (
                    <div
                      key={method}
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <RadioGroupItem value={method} id={method} />
                      <Label
                        htmlFor={method}
                        className="flex cursor-pointer items-center"
                      >
                        <span className="flex items-center gap-2">
                          {getMethodIcon(method)}
                          {getMethodLabel(method)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="twoFactorCode">Verification Code</Label>
              <Input
                id="twoFactorCode"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />

              {selectedMethod === 'email' && (
                <div className="mt-2">
                  {emailCodeSent ? (
                    <p className="text-sm text-muted-foreground">
                      A verification code has been sent to your email address
                    </p>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex w-full items-center gap-1"
                      onClick={handleSendEmailCode}
                      disabled={isSendingEmailCode}
                    >
                      <Send className="h-4 w-4" />
                      {isSendingEmailCode
                        ? 'Sending...'
                        : 'Send Verification Email'}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isCompletingTwoFactorLogin}
            >
              {isCompletingTwoFactorLogin ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => window.location.reload()}
            className="px-2"
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Regular login form
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">Email is required</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">Password is required</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
