import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import useAuthStore from '@/stores/authStore';
import toast from 'react-hot-toast';
import Router from 'next/router';

type Props = {};

const Signin: NextPage<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = Router;
  const setTokens = useAuthStore((state) => state.setTokens);

  const handleSubmit = async () => {
    const endpoint = process.env.NEXT_PUBLIC_USER_URL + '/login';
    const userData = {
      email,
      password
    };

    try {
      const response = await axios.post(endpoint, userData);

      if (!response.status) {
        toast.error('Invalid response from server.');
        throw new Error('Something went wrong with the login process');
      } else {
        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        toast.success('Login successful!');
        router.back();
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        // Unauthorized
        toast.error('Invalid email or password');
      } else {
        toast.error(error?.response.status + ' ' + error?.response.statusText);
        console.log(error);
      }
    }
  };

  return (
    <>
      <SigninHead />
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Sign In</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Log in to your Snapcaster account.
                </p>
              </div>
              <div className="grid gap-4 md:gap-4">
                <input
                  type="text"
                  className="block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                <input
                  type="password"
                  className="block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  onClick={handleSubmit}
                  className="mt-2 p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600"
                >
                  Sign In
                </button>
                <button className="">
                  <a href="/signup">Dont have an account? Sign up!</a>
                </button>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Signin;

const SigninHead = () => {
  return (
    <Head>
      <title>Signin</title>
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
