import Link from 'next/link';

import { CheckCircle } from 'lucide-react';
import { type NextPage } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword: NextPage = () => {
  const { forgotPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  type Submision = {
    email: string;
  };
  const onSubmit = async (data: Submision) => {
    const { email } = data;
    await forgotPassword(email, {
      onSuccess: () => {
        toast({
          title: 'Reset email sent',
          description: 'Check your email for a password reset link.'
        });
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast({
          title: 'Error sending reset email',
          description: error.message
        });
      }
    });
  };

  return (
    <>
      <h1 className="sr-only">Reset Your Snapcaster Password</h1>
      <PageHead
        title="Snapcaster | Forgot Password"
        description="Enter your email to receive a password reset link."
        url="https://snapcaster.ca/forgot-password"
      />

      <section className="flex w-full justify-center py-6 md:py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: /^\S+@\S+\.\S+$/
                })}
                type="text"
                placeholder="m@example.com"
                disabled={isSubmitted}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              {errors.email?.type === 'pattern' && (
                <p className="text-red-500">Invalid email</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitted}>
                {isSubmitted ? 'Email Sent' : 'Send reset link'}
              </Button>
            </form>
            {isSubmitted && (
              <Alert className="mt-4" variant="success">
                <CheckCircle className="size-4" />
                <AlertDescription>
                  If an account exists with this email, you will receive a
                  password reset link shortly.
                </AlertDescription>
              </Alert>
            )}
            <div className="mt-4 text-center text-sm">
              Know your password?{' '}
              <Link href="/signin" className="underline">
                Sign in.
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default ForgotPassword;
