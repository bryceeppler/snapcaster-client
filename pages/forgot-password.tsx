import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

type Props = {};

const ForgotPassword: NextPage<Props> = () => {
  const { forgotPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    }
  };

  return (
    <>
      <ForgotPasswordHead />
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
                  If an account exists with this email, you will receive a password reset link shortly.
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

const ForgotPasswordHead = () => {
  return (
    <Head>
      <title>Forgot Password</title>
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
