import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosWrapper';
import useAuthStore from '@/stores/authStore';
import Signin from './signin';
import LoadingPage from '@/components/loading-page';
import { Button } from '@/components/ui/button';
// import SubscriptionCards from '@/components/subscription-options';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { CheckCircle2 } from 'lucide-react';

const Profile: NextPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    fetchUser,
    hasActiveSubscription,
    email,
    fullName,
    emailVerified,
    discordUsername,
    setDiscordUsername,
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
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
  };

  const createDiscordAuth = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_USER_URL}/auth/discord/`
      );
      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error('Error creating discord session:', error);
    }
  };

  const disconnectDiscordAuth = async () => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_USER_URL}/auth/discord/disconnect`
      );
      if (response.status !== 200) throw new Error('Failed to disconnect');
      toast.success('Discord account disconnected');
      setDiscordUsername('');
    } catch (error) {
      console.error('Error disconnecting discord account:', error);
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
      <section className="flex w-full justify-center py-6 md:py-12">
        <div className="flex w-full flex-col justify-center gap-6">
          {/* {!hasActiveSubscription && (
            <SubscriptionCards createCheckoutSession={createCheckoutSession} />
          )} */}

          <UserSettings
            email={email}
            fullName={fullName}
            discordUsername={discordUsername}
            hasActiveSubscription={hasActiveSubscription}
            emailVerified={emailVerified}
            createPortalSession={createPortalSession}
            disconnectDiscordAuth={disconnectDiscordAuth}
            createCheckoutSession={createCheckoutSession}
            handleLogout={handleLogout}
            createDiscordAuth={createDiscordAuth}
          />
        </div>
      </section>
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
  createCheckoutSession,
  createPortalSession,
  createDiscordAuth,
  disconnectDiscordAuth,
  handleLogout
}: {
  email: string;
  fullName: string;
  hasActiveSubscription: boolean;
  emailVerified: boolean;
  discordUsername: string;
  createCheckoutSession: () => void;
  createPortalSession: () => void;
  createDiscordAuth: () => void;
  disconnectDiscordAuth: () => void;
  handleLogout: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: ''
    }
  });

  type Submission = {
    fullName: string;
  };

  const onSubmit = async (data: Submission) => {
    const { fullName } = data;
    const endpoint = process.env.NEXT_PUBLIC_USER_URL + '/update';

    try {
      const response = await axios.post(endpoint, { fullName });

      if (!response.status) {
        toast.error('Invalid response from server.');
        throw new Error('Something went wrong with the update process');
      } else {
        toast.success('Username changed successfully!');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error('Invalid input');
      } else {
        toast.error('An error occurred during login');
        console.error(error);
      }
    }
  };
  return (
    <Card className="lg mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Settings</CardTitle>
        <CardDescription>Adjust your account settings.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:gap-4">
        <form className="grid gap-4 md:gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="email">Name</Label>
            <Input
              {...register('fullName', {
                required: 'Name is required'
              })}
              type="text"
              disabled={true}
              placeholder={fullName}
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}
            {errors.fullName?.type === 'pattern' && (
              <p className="text-red-500">Invalid name</p>
            )}
          </div>
        </form>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input type="text" disabled={true} value={email} />
        </div>

        {/* discord */}
        <Card>
          <CardHeader>
            <DiscordLogoIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-md">Discord</CardTitle>
            <CardDescription>
              Pro members gain access to exlcusive channels and giveaways after
              connecting their Discord!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {' '}
            {discordUsername ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm">Connected as {discordUsername}</p>
                </div>
                <Button variant="outline" onClick={disconnectDiscordAuth}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <div>
                <Button onClick={createDiscordAuth}>Connect</Button>
                <p className="py-2 text-xs ">
                  By clicking connect, you confirm that you have read,
                  understood, and consent to the{' '}
                  <a
                    href="/privacy"
                    className="text-primary underline hover:opacity-70"
                  >
                    Privacy Notice
                  </a>{' '}
                  and{' '}
                  <a
                    href="/terms"
                    className="text-primary underline hover:opacity-70"
                  >
                    Terms & Conditions
                  </a>
                  .
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Snapcaster Pro</CardTitle>
            <CardDescription>
              Subscribe to Snapcaster Pro for access to premium features and
              giveaways.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-between">
              <p className="text-sm">Snapcaster Pro</p>
              {hasActiveSubscription ? (
                <p className="text-sm">Active</p>
              ) : (
                <p className="text-sm text-zinc-400">Inactive</p>
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm font-semibold text-zinc-400">
                Multi search up to 100 cards at a time
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm font-semibold text-zinc-400">
                Single search advanced filtering
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm font-semibold text-zinc-400">
                Pro exclusive Discord giveaways (Singles, Packs, Merch)
              </p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="aspect-square h-2 w-2 rounded-full bg-primary"></div>
              <p className="text-sm font-semibold text-zinc-400">
                Reduced Ads (Side Banners, Inline Banners, Promoted Results)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            {' '}
            {hasActiveSubscription ? (
              <Button className="w-full" onClick={createPortalSession}>
                Manage subscription
              </Button>
            ) : (
              <div>
                <Button onClick={createCheckoutSession}>Subscribe</Button>
                <p className="py-2 text-xs ">
                  By clicking subscribe, you confirm that you have read,
                  understood, and consent to the{' '}
                  <a
                    href="/privacy"
                    className="text-primary underline hover:opacity-70"
                  >
                    Privacy Notice
                  </a>{' '}
                  and{' '}
                  <a
                    href="/terms"
                    className="text-primary underline hover:opacity-70"
                  >
                    Terms & Conditions
                  </a>
                  .
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
      </CardContent>
      <CardFooter className="justify-end">
        {' '}
        <Button onClick={handleLogout}>Logout</Button>
      </CardFooter>
    </Card>
  );
};
