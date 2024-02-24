import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import useAuthStore from '@/stores/authStore';
import Signin from './signin';
import LoadingPage from '@/components/LoadingPage';

type UserProfile = {
  email: string;
  fullName: string;
};

const Profile: NextPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_USER_URL}/profile`
        );
        if (response.status !== 200)
          throw new Error('Failed to fetch user profile');
        const data: UserProfile = await response.data;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false after the fetch operation
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Signin />;
  }

  return (
    <>
      <ProfileHead />
      <MainLayout>
        <div className="w-full max-w-xl flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12 max-w-2xl mx-auto">
            <div className="w-full container grid md:px-6 gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Profile</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your Snapcaster profile
                </p>
              </div>
              <div className="flex flex-row gap-2 w-full mx-auto">
                {/* free price card */}
                {/* should expand to match height of premium card */}
                <div className="flex flex-col w-full">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex flex-col text-left p-6 rounded-md outline outline-2 outline-zinc-700 w-full">
                      <h3 className="font-semibold text-white">Free</h3>
                      <h2 className="text-2xl font-bold">
                        $0 <span className="text-sm font-normal">/mo</span>
                      </h2>
                      <div className="p-1" />

                      {/* description */}
                      <p className="text-sm text-zinc-500">
                        Search for MTG singles across Canada.
                      </p>
                      <div className="p-2" />
                      {/* stack for features */}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm text-zinc-400">
                            Search over 60 Canadian stores
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm font-semibold text-zinc-400">
                            Search up to 5 cards at a time{' '}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 flex-grow" />
                      {/* upgrade now btn */}
                      <button className="w-full outline outline-2 outline-zinc-400 text-white font-bold rounded-md text-sm p-4">
                        Start searching
                      </button>
                    </div>
                    <div className="flex flex-col text-left p-6 rounded-md outline outline-2 outline-zinc-700 w-full">
                      <h3 className="font-semibold text-pink-400">Pro</h3>
                      <h2 className="text-2xl font-bold">
                        $3.99 <span className="text-sm font-normal">/mo</span>
                      </h2>
                      <div className="p-1" />

                      {/* description */}
                      <p className="text-sm text-zinc-500">
                        Support Snapcaster and get access to premium features
                        and future updates.
                      </p>
                      <div className="p-2" />
                      {/* stack for features */}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm font-semibold text-zinc-400">
                            Search over 60 Canadian stores
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm font-semibold text-zinc-400">
                            Search up to 100 cards at a time
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm font-semibold text-zinc-400">
                            Price monitoring and email notifications
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <div className="aspect-square w-3 h-3 bg-pink-400 rounded-full"></div>
                          <p className="text-sm font-semibold text-zinc-400">
                            Beta access to new features
                          </p>
                        </div>
                      </div>
                      <div className="p-4" />
                      {/* upgrade now btn */}
                      <button className="w-full bg-white text-black text-sm font-bold rounded-md p-4">
                        Upgrade now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6" />
            <div className="p-4" />
          </section>
        </div>
      </MainLayout>
    </>
  );
};

export default Profile;

const ProfileHead = () => {
  return (
    <Head>
      <title>Profile</title>
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
