import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import Router from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Profile from './profile';
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

type Props = {};

const Signin: NextPage<Props> = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const router = Router;
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
        // direct to home page after login
        // router.push('/');
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

  if (isAuthenticated) {
    return <Profile />;
  }

  return (
    <>
      <SigninHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Log in to your Snapcaster account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: /^\S+@\S+\.\S+$/
                  })}
                  type="text"
                  className=""
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type="password"
                  className=""
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
      </section>
    </>
  );
};

export default Signin;

const SigninHead = () => {
  return (
    <Head>
      <title>Sign In</title>
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
