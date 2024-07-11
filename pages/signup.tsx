import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import Router from 'next/router';
import { toast } from 'sonner';
import useAuthStore from '@/stores/authStore';
import Profile from './profile';
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
  CardContent,
  CardFooter
} from '@/components/ui/card';

type SignupFormData = {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
};

type Props = {};

const Signup: NextPage<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SignupFormData>();

  const router = Router;
  const { isAuthenticated } = useAuthStore();

  const onSubmit = async (data: SignupFormData) => {
    const { email, password, fullName } = data;
    const endpoint = `${process.env.NEXT_PUBLIC_USER_URL}/register`;

    try {
      const response = await axios.post(endpoint, {
        email,
        password,
        fullName
      });
      if (response.status !== 200) {
        throw new Error('Something went wrong with the registration process');
      }
      toast.success('Registration successful! You can now sign in.');
      router.push('/signin');
    } catch (error: any) {
      console.log(error);
      toast.error('Could not register user');
    }
  };
  const password = watch('password');

  if (isAuthenticated) {
    return <Profile />;
  }
  return (
    <>
      <SignupHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your Snapcaster account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-2">
                <Label htmlFor="fullName">Name</Label>
                <Input
                  type="text"
                  {...register('fullName', {
                    required: 'A name is required'
                  })}
                  className={``}
                  placeholder="Al Dente"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName.message}</p>
                )}
              </div>{' '}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: /^\S+@\S+\.\S+$/
                  })}
                  type="text"
                  className={``}
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
                {errors.email?.type === 'pattern' && (
                  <p className="text-red-500">Invalid email</p>
                )}{' '}
              </div>{' '}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className={``}
                  placeholder=""
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}{' '}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) =>
                      value === password || 'The passwords do not match'
                  })}
                  className={``}
                  placeholder=""
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit">Sign Up</Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="underline">
                Sign in.
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs">
              By creating an account, you confirm that you have read,
              understood, and consent to the{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-primary hover:opacity-70"
              >
                Terms of Use
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};

export default Signup;

const SignupHead = () => {
  return (
    <Head>
      <title>Sign Up</title>
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
