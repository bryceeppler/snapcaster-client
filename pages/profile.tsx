import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import useAuthStore from '@/stores/authStore';
import Signin from './signin';
import LoadingPage from '@/components/loading-page';
import { Button } from '@/components/ui/button';
import SubscriptionCards from '@/components/subscription-options';
import { toast } from 'sonner';

const Profile: NextPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    fetchUser,
    hasActiveSubscription,
    email,
    fullName,
    emailVerified,
    discordUsername,
    clearTokens
  } = useAuthStore();

  const handleLogout = () => {
    clearTokens();
    toast.success('You have been logged out');
  };

  const [loading, setLoading] = useState(true);

  const createCheckoutSession = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createcheckoutsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      console.log('Checkout session created:', data);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const createPortalSession = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_PAYMENT_URL}/createportalsession`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      console.log('Portal session created:', data);
      // Redirect to Stripe portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  const createDiscordAuth = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_USER_URL}/auth/discord`
      );
      if (response.status !== 200) throw new Error('Failed to create session');
      const data = await response.data;
      console.log('Discord session created:', data);
      // Redirect to Discord auth
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating discord session:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        fetchUser();
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
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
      <div className="mx-auto flex w-full max-w-xl flex-col justify-center gap-8 text-center">
        <section className="w-full py-6 md:py-12">
          <div className="grid w-full gap-6">
            <>
              {!hasActiveSubscription && (
                <SubscriptionCards
                  createCheckoutSession={createCheckoutSession}
                />
              )}

              <UserSettings
                email={email}
                fullName={fullName}
                discordUsername={discordUsername}
                hasActiveSubscription={hasActiveSubscription}
                emailVerified={emailVerified}
                createPortalSession={createPortalSession}
                handleLogout={handleLogout}
                createDiscordAuth={createDiscordAuth}
              />
            </>
          </div>
        </section>
      </div>
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
const UserSettings = ({
  email,
  fullName,
  hasActiveSubscription,
  discordUsername,
  createPortalSession,
  createDiscordAuth,
  handleLogout
}: {
  email: string;
  fullName: string;
  hasActiveSubscription: boolean;
  emailVerified: boolean;
  discordUsername: string;
  createPortalSession: () => void;
  createDiscordAuth: () => void;
  handleLogout: () => void;
}) => {
  return (
    <div className="outlined-container container flex flex-col overflow-hidden  p-4 text-left">
      <h3 className="text-lg font-bold">Settings</h3>
      <div className="p-2" />
      {/* user info container */}
      <div className="flex flex-col gap-2 p-3">
        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="hidden text-sm text-zinc-500 md:flex">
            Discord username
          </p>
          <p className="text-sm text-zinc-400">{discordUsername}</p>
        </div>
        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="hidden text-sm text-zinc-500 md:flex">Full name</p>
          <p className="text-sm text-zinc-400">{fullName}</p>
        </div>
        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="hidden text-sm text-zinc-500 md:flex">Email</p>
          <p className="max-w-full truncate text-sm text-zinc-400">{email}</p>
        </div>
      </div>
      <div className="p-2" />
      {/* subscription container */}
      <div className="flex flex-col gap-2 p-3 ">
        <div className="outlined-container flex flex-col gap-2 p-2">
          <div className="flex flex-row justify-between">
            <p className="text-sm text-zinc-500">Subscription</p>
            {hasActiveSubscription ? (
              <p className="text-sm text-zinc-400">
                Snapcaster <span className="font-bold text-primary">Pro</span>
              </p>
            ) : (
              <p className="text-sm text-zinc-400">Inactive</p>
            )}
          </div>
          {/* list their premium features */}
          {hasActiveSubscription && (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search over 65 Canadian stores
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Search up to 100 cards at a time
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Advanced filtering for card searches and multi-search
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Exclusive discount codes for Snapcaster partners
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  Participate in Snapcaster giveaways
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
                <p className="text-sm font-semibold text-zinc-400">
                  See less ads
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-2" />
      {hasActiveSubscription && (
        <div className="flex w-full flex-col p-3">
          <Button onClick={createPortalSession}>Manage subscription</Button>
        </div>
      )}
      <div className="">
        <Button onClick={createDiscordAuth}>Link Discord</Button>
      </div>
      <div className="flex w-full flex-col p-3">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};
