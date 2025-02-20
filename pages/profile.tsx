import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Signin from './signin';
import LoadingPage from '@/components/loading-page';
import { Button } from '@/components/ui/button';
import { createCheckoutSession, createPortalSession } from '@/lib/utils';
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
import { CheckCircle2, Loader2 } from 'lucide-react';
import ModeToggle from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';

const Profile: NextPage = () => {
  const { 
    profile,
    isLoadingProfile,
    isAuthenticated,
    logout,
    connectDiscord,
    disconnectDiscord,
    updateProfile
  } = useAuth();

  if (isLoadingProfile) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Signin />;
  }

  const user = profile?.data?.user;

  return (
    <>
      <ProfileHead />
      <section className="flex w-full justify-center py-6 md:py-12">
        <div className="flex w-full flex-col justify-center gap-6">
          <UserSettings
            email={user?.email || ''}
            fullName={user?.fullName || ''}
            discordUsername={user?.discordUsername || ''}
            hasActiveSubscription={user?.subscription === 'active'}
            emailVerified={user?.emailVerified || false}
            createPortalSession={createPortalSession}
            disconnectDiscordAuth={disconnectDiscord}
            createCheckoutSession={createCheckoutSession}
            handleLogout={logout}
            createDiscordAuth={connectDiscord}
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
  const { isDisconnectingDiscord, updateProfile } = useAuth();
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
    updateProfile(data);
  };

  return (
    <Card className="lg mx-auto w-full max-w-lg bg-popover">
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
        {/* dark mode */}
        <ModeToggle />

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
            {discordUsername ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm">Connected as {discordUsername}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={disconnectDiscordAuth}
                  disabled={isDisconnectingDiscord}
                >
                  {isDisconnectingDiscord ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Disconnect'
                  )}
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
        <Button onClick={handleLogout}>Logout</Button>
      </CardFooter>
    </Card>
  );
};
