import React from 'react';
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
  CardContent
} from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  redirectUrl?: string;
};

type SignInFormData = {
  email: string;
  password: string;
};

const SignInForm = (props: Props) => {
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: SignInFormData) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Log in to your Snapcaster account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: /^\S+@\S+\.\S+$/
              })}
              type="text"
              placeholder="m@example.com"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
            {errors.email?.type === 'pattern' && (
              <p className="text-red-500">Invalid email</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col gap-1 md:flex-row md:items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="inline-block text-sm text-muted-foreground underline md:ml-auto"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              {...register('password', {
                required: 'Password is required'
              })}
              type="password"
              placeholder=""
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up.
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
