'use client';

import { useState, useEffect } from 'react';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
export function IntegrationsSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { connectDiscord, disconnectDiscord, profile } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('discord_connected') === 'true') {
      toast({
        title: 'Discord connected',
        description: 'Your Discord account has been successfully connected.'
      });
    }
  }, [searchParams, toast]);

  const handleConnect = async () => {
    connectDiscord(undefined, {
      onError: (error) => {
        toast({
          title: 'Error connecting to Discord',
          description: error.message
        });
      }
    });
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnectDiscord();
      toast({
        title: 'Discord disconnected',
        description: 'Your Discord account has been disconnected.'
      });
    } catch (error) {
      toast({
        title: 'Error disconnecting Discord',
        description:
          'An error occurred while disconnecting your Discord account.',
        variant: 'destructive'
      });
      console.error('Discord disconnect error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Integrations</CardTitle>
        <CardDescription>
          Connect your account with third-party services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2]/10">
                <DiscordLogoIcon className="h-5 w-5 text-[#5865F2]" />
              </div>
              <div>
                <p className="text-sm font-medium leading-none">Discord</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.data?.user?.discordId
                    ? 'Your Discord account is connected'
                    : 'Connect your Discord account'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {profile?.data?.user?.discordId ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                </>
              ) : (
                <Button onClick={handleConnect} disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
