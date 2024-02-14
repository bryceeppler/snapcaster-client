import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
type Props = {};

const Signup: NextPage<Props> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const endpoint = `${process.env.NEXT_PUBLIC_USER_URL}/register/`
    const userData = {
      email,
      password,
      fullName,
    };

    try {
      const response = await axios.post(endpoint, userData);
      if (response.status !== 201) {
        throw new Error('Something went wrong with the registration process');
      }
      setMessage('Registration successful!');
    } catch (error: any) {
      setMessage(error?.message || 'Something went wrong with the registration process');
    }
  };
  return (
    <>
      <SignupHead />
      <MainLayout>
        <div className="w-full max-w-md flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="container grid max-[1fr_900px] md:px-6 items-start gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Signup</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Create your Snapcaster account. 
                </p>
                {message && <p>{message}</p>}

              </div>
              <div className="grid gap-4 md:gap-4">
                <div className="relative">
                  <input
                    type="text"
                    className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className={`block w-full rounded-md border border-zinc-300 px-4 py-2 placeholder-zinc-500 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm text-white bg-zinc-800`}
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="mt-2 p-2 bg-neutral-700 rounded-lg hover:bg-neutral-600"
                >
                  Sign Up
                </button>
                <button
                    className=''
                >
                <a href="/signin">Already have an account? Sign in!</a>
                </button>
              </div>
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
