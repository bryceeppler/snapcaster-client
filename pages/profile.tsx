import MainLayout from '@/components/MainLayout';
import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import useAuthStore from '@/stores/authStore';
import Signin from './signin';
import LoadingPage from '@/components/LoadingPage';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import SubscriptionCards from '@/components/SubscriptionCards';
import { toast } from 'sonner';

const Profile: NextPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    fetchUser,
    hasActiveSubscription,
    email,
    fullName,
    emailVerified,
    betaFeaturesEnabled,
    toggleBetaFeatures,
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
  const { control, reset } = useForm({
    defaultValues: {
      betaFeaturesEnabled: betaFeaturesEnabled
    }
  });

  useEffect(() => {
    reset({ betaFeaturesEnabled });
  }, [betaFeaturesEnabled, reset]);

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
      <MainLayout>
        <div className="container flex-1 flex-col justify-center text-center">
          <section className="w-full py-6 md:py-12">
            <div className="grid w-full gap-6">
              {hasActiveSubscription && (
                <>
                  <UserSettings
                    email={email}
                    fullName={fullName}
                    hasActiveSubscription={hasActiveSubscription}
                    emailVerified={emailVerified}
                    createPortalSession={createPortalSession}
                    toggleBetaFeatures={toggleBetaFeatures}
                    control={control}
                    handleLogout={handleLogout}
                  />
                </>
              )}
              {!hasActiveSubscription && (
                <>
                  <UserSettings
                    email={email}
                    fullName={fullName}
                    hasActiveSubscription={hasActiveSubscription}
                    emailVerified={emailVerified}
                    createPortalSession={createPortalSession}
                    toggleBetaFeatures={toggleBetaFeatures}
                    control={control}
                    handleLogout={handleLogout}
                  />
                  <SubscriptionCards
                    createCheckoutSession={createCheckoutSession}
                  />
                </>
              )}
            </div>
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
const UserSettings = ({
  email,
  fullName,
  hasActiveSubscription,
  emailVerified,
  createPortalSession,
  toggleBetaFeatures,
  control,
  handleLogout
}: {
  email: string;
  fullName: string;
  hasActiveSubscription: boolean;
  emailVerified: boolean;
  createPortalSession: () => void;
  toggleBetaFeatures: () => void;
  control: any;
  handleLogout: () => void;
}) => {
  return (
    <div className="outlined-container container flex max-w-xl flex-col overflow-hidden  p-4 text-left">
      <h3 className="text-lg font-bold">Settings</h3>
      <div className="p-2" />
      {/* user info container */}
      <div className="flex flex-col gap-2 p-3">
        {/* email container */}
        {emailVerified && (
          <div className="flex flex-row items-center gap-2 text-xs">
            <div className="aspect-square h-2 w-2 rounded-full bg-green-400"></div>
            <p className="text-sm text-zinc-500">Email verified</p>
          </div>
        )}
        {!emailVerified && (
          <div className="flex flex-row items-center gap-2 text-xs">
            <div className="aspect-square h-2 w-2 rounded-full bg-red-400"></div>
            <p className="text-sm text-zinc-500">Email not verified</p>
          </div>
        )}

        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="hidden text-sm text-zinc-500 md:flex">Email</p>
          <p className="max-w-full truncate text-sm text-zinc-400">{email}</p>
        </div>
        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="hidden text-sm text-zinc-500 md:flex">Full name</p>
          <p className="text-sm text-zinc-400">{fullName}</p>
        </div>
      </div>
      <div className="p-2" />
      {/* subscription container */}
      <div className="flex flex-col gap-2 p-3 ">
        <div className="outlined-container flex flex-row justify-between p-2">
          <p className="text-sm text-zinc-500">Subscription</p>
          {hasActiveSubscription ? (
            <p className="text-sm text-zinc-400">
              Snapcaster <span className="font-bold text-pink-500">Pro</span>
            </p>
          ) : (
            <p className="text-sm text-zinc-400">Inactive</p>
          )}
        </div>
        <Controller
          name="betaFeaturesEnabled"
          control={control}
          render={({ field }) => (
            <div className="outlined-container flex flex-row items-center justify-between p-2">
              <p className="text-sm text-zinc-500">Beta features</p>
              {!hasActiveSubscription ? (
                <p className="text-sm text-zinc-400">Disabled</p>
              ) : (
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only" // Hide the checkbox but make it accessible to screen readers
                    checked={field.value}
                    disabled={!hasActiveSubscription}
                    onChange={(e) => {
                      if (!hasActiveSubscription) return;
                      field.onChange(e.target.checked);
                      toggleBetaFeatures();
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-zinc-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:border-gray-600 dark:peer-focus:ring-pink-800"></div>
                </label>
              )}
            </div>
          )}
        />
      </div>
      <div className="p-2" />
      {hasActiveSubscription && (
        <div className="flex w-full flex-col p-3">
          <Button onClick={createPortalSession}>Manage subscription</Button>
        </div>
      )}
      <div className="flex w-full flex-col p-3">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};
