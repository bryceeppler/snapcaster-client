import { type NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Signin from './signin';
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
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import ThemeSelector from '@/components/theme-selector';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface UserProfile {
  email: string;
  fullName: string;
  discordUsername: string;
  hasActiveSubscription: boolean;
  emailVerified: boolean;
}

interface UserSettingsProps {
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
  resendVerificationEmail: () => void;
  isResendingVerification: boolean;
}

interface ProfileSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

// Reusable Components
const ProfileSection = ({ title, description, children }: ProfileSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const VerificationStatus = ({ 
  isVerified, 
  onResend, 
  isResending 
}: { 
  isVerified: boolean; 
  onResend: () => void; 
  isResending: boolean;
}) => (
  <div>
    {isVerified ? (
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-medium">Email verified</span>
      </div>
    ) : (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Email not verified</span>
          </div>
          <p className="text-xs">
            Please verify your email. Check your inbox for the verification link.
          </p>
          <Button 
            size="sm"
            onClick={onResend}
            disabled={isResending}
            variant="tertiary"
            className="w-fit"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                <span>Sending verification email...</span>
              </>
            ) : (
              <>
                <span>Resend verification email</span>
              </>
            )}
          </Button>
        </div>
      </div>
    )}
  </div>
);

const ProfileInformationForm = ({ 
  user,
  onUpdateProfile,
  onResendVerification,
  isResendingVerification
}: { 
  user: UserProfile;
  onUpdateProfile: (data: { fullName: string }) => void;
  onResendVerification: () => void;
  isResendingVerification: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: user.fullName,
      email: user.email
    }
  });

  return (
    <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Name</Label>
        <Input
          type="text"
          id="fullName"
          disabled={true}
          value={user.fullName}
          className="max-w-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          type="text" 
          id="email"
          disabled={true} 
          value={user.email}
          className="max-w-md"
        />
        <VerificationStatus 
          isVerified={user.emailVerified}
          onResend={onResendVerification}
          isResending={isResendingVerification}
        />
      </div>
    </form>
  );
};

const DiscordSection = ({
  username,
  onConnect,
  onDisconnect,
  isDisconnecting
}: {
  username: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isDisconnecting: boolean;
}) => (
  <Card>
    <CardHeader className="space-y-1">
      <div className="flex items-center gap-2">
        <DiscordLogoIcon className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-semibold">Discord Integration</CardTitle>
      </div>
      <CardDescription>
        Pro members gain access to exclusive channels and giveaways after
        connecting their Discord!
      </CardDescription>
    </CardHeader>
    <CardContent>
      {username ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm">Connected as {username}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={onDisconnect}
            disabled={isDisconnecting}
            className="w-full sm:w-auto"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect Discord'
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            onClick={onConnect}
            className="w-full sm:w-auto"
          >
            Connect Discord
          </Button>
          <p className="text-xs text-muted-foreground">
            By connecting, you agree to our{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Notice
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </a>
            .
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

const SubscriptionSection = ({
  isActive,
  onManage,
  onSubscribe
}: {
  isActive: boolean;
  onManage: () => void;
  onSubscribe: () => void;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl font-semibold">Snapcaster Pro</CardTitle>
      <CardDescription>
        Subscribe to Snapcaster Pro for access to premium features and giveaways.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-medium">Subscription Status</span>
        <span className={isActive ? "text-primary" : "text-muted-foreground"}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="space-y-2">
        <FeatureItem text="Multi search up to 100 cards at a time" />
        <FeatureItem text="Pro exclusive Discord giveaways (Singles, Packs, Merch)" />
        <FeatureItem text="Reduced Ads (Side Banners, Inline Banners, Promoted Results)" />
      </div>
    </CardContent>
    <CardFooter>
      {isActive ? (
        <Button 
          className="w-full sm:w-auto" 
          onClick={onManage}
        >
          Manage subscription
        </Button>
      ) : (
        <div className="space-y-4 w-full">
          <Button 
            onClick={onSubscribe}
            className="w-full sm:w-auto"
          >
            Subscribe Now
          </Button>
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Notice
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </a>
            .
          </p>
        </div>
      )}
    </CardFooter>
  </Card>
);

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-2">
    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
    <span className="text-sm">{text}</span>
  </div>
);

const AccountActions = ({ onLogout }: { onLogout: () => void }) => (
  <ProfileSection
    title="Account Actions"
    description="Manage your account access."
  >
    <Button 
      variant="destructive" 
      onClick={onLogout}
      className="w-full sm:w-auto"
    >
      Sign Out
    </Button>
  </ProfileSection>
);

const UserSettings = ({
  email,
  fullName,
  hasActiveSubscription,
  discordUsername,
  emailVerified,
  createCheckoutSession,
  createPortalSession,
  createDiscordAuth,
  disconnectDiscordAuth,
  handleLogout,
  resendVerificationEmail,
  isResendingVerification
}: UserSettingsProps) => {
  const { isDisconnectingDiscord, updateProfile } = useAuth();
  const user: UserProfile = {
    email,
    fullName,
    discordUsername,
    hasActiveSubscription,
    emailVerified
  };

  return (
    <div className="grid gap-6">
      <ProfileSection
        title="Profile Information"
        description="Update your personal information."
      >
        <ProfileInformationForm 
          user={user}
          onUpdateProfile={updateProfile}
          onResendVerification={resendVerificationEmail}
          isResendingVerification={isResendingVerification}
        />
      </ProfileSection>

      <ProfileSection
        title="Appearance"
        description="Customize how Snapcaster looks on your device."
      >
        <ThemeSelector />
      </ProfileSection>

      <DiscordSection
        username={discordUsername || null}
        onConnect={createDiscordAuth}
        onDisconnect={disconnectDiscordAuth}
        isDisconnecting={isDisconnectingDiscord}
      />

      <SubscriptionSection
        isActive={hasActiveSubscription}
        onManage={createPortalSession}
        onSubscribe={createCheckoutSession}
      />

      <AccountActions onLogout={handleLogout} />
    </div>
  );
};

const ProfileSectionSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-10 w-full max-w-md" />
    </CardContent>
  </Card>
);

const DiscordSectionSkeleton = () => (
  <Card>
    <CardHeader className="space-y-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-48" />
      </div>
      <Skeleton className="h-4 w-72 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </CardContent>
  </Card>
);

const SubscriptionSectionSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72 mt-2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-32" />
    </CardFooter>
  </Card>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <div className="grid gap-6">
          <ProfileSectionSkeleton />
          <ProfileSectionSkeleton />
          <DiscordSectionSkeleton />
          <SubscriptionSectionSkeleton />
          <ProfileSectionSkeleton />
        </div>
      </div>
    </div>
  </div>
);

// Main Profile Page Component
const Profile: NextPage = () => {
  const { 
    profile,
    isLoadingProfile,
    isAuthenticated,
    logout,
    connectDiscord,
    disconnectDiscord,
    updateProfile,
    resendVerificationEmail,
    isResendingVerification
  } = useAuth();

  if (isLoadingProfile) {
    return (
      <>
        <ProfileHead />
        <ProfileSkeleton />
      </>
    );
  }

  if (!isAuthenticated) {
    return <Signin />;
  }

  const user = profile?.data?.user;

  return (
    <>
      <ProfileHead />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>
            <div className="grid gap-6">
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
                resendVerificationEmail={resendVerificationEmail}
                isResendingVerification={isResendingVerification}
              />
            </div>
          </div>
        </div>
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
