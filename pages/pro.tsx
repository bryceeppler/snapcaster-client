import MainLayout from '@/components/main-page-layout';
import { type NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Profile from './profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {};

const Pro: NextPage<Props> = () => {
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
        router.back();
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
      <ProHead />
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="max-[1fr_900px] container grid items-start gap-6 md:px-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Sign In</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Log in to your Snapcaster account.
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
                  className=""
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
                {errors.email?.type === 'pattern' && (
                  <p className="text-red-500">Invalid email</p>
                )}
                <Input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type="password"
                  className=""
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
                <Button type="submit">Sign In</Button>
              </form>
              <a href="/forgot-password">Forgot your password?</a>
              <a href="/signup">Don't have an account? Sign up!</a>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Pro;

const ProHead = () => {
  return (
    <Head>
      <title>Pro</title>
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
