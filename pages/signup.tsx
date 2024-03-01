import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import Router from 'next/router';
import { toast } from "sonner";
import useAuthStore from '@/stores/authStore';
import Profile from './profile';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';

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
    watch,

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
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Signup</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your Snapcaster account.
                </p>
              </div>
              <form
                className="grid gap-4 md:gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: /^\S+@\S+\.\S+$/
                  })}
                  type="text"
                  className={``}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
                {errors.email?.type === 'pattern' && (
                  <p className="text-red-500">Invalid email</p>
                )}

                <Input
                  type="password"
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className={``}
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                                <Input
                  type="password"
                  {...register('confirmPassword', {
                    validate: value =>
                      value === password || 'The passwords do not match',
                  })}
                  className={``}
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">{errors.confirmPassword.message}</p>
                )}
                <Input
                  type="text"
                  {...register('fullName', {
                    required: 'A name is required'
                  })}
                  className={``}
                  placeholder="Full Name"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName.message}</p>
                )}
                <Button
                  type="submit"
                              >
                  Sign Up
                </Button>
                <Button className="">
                  <a href="/signin">Already have an account? Sign in!</a>
                </button>
                <p className='text-xs'>By Creating an account, you affirm that you have read, understood, and consent to the <a href="/terms" target="_blank" className="text-pink-500 hover:text-pink-700">Terms of Use</a></p>
              </form>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Signup;

const SignupHead = () => {
  return (
    <Head>
      <title>Signup</title>
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
