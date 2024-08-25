import React from 'react';
import axios from 'axios';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import Router from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

type Props = {
  noborder?: boolean;
};

const SignInCard = (props: Props) => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  type Submision = {
    email: string;
    password: string;
  };
  const onSubmit = async (data: Submision) => {
    const { email, password } = data;
    const endpoint = process.env.NEXT_PUBLIC_USER_URL + '/login';

    try {
      const response = await axios.post(endpoint, { email, password });

      if (!response.status) {
        toast.error('Invalid response from server.');
        throw new Error('Something went wrong with the login process');
      } else {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        toast.success('Login successful!');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error('An error occurred during login');
        console.error(error);
      }
    }
  };
  return (
    <Card
      className={`w-full max-w-sm
      ${props.noborder && 'border-0 outline-0'}
    `}
    >
      <CardHeader className={`${props.noborder && 'px-0'}`}>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Log in to your Snapcaster account.</CardDescription>
      </CardHeader>
      <CardContent className={`${props.noborder && 'px-0'}`}>
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
          <Button type="submit">Sign In</Button>
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

export default SignInCard;
