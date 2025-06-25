'use client';

import { useSearchParams } from 'next/navigation';

import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ApiKeysSection } from './api-keys-section';

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Integrations</CardTitle>
          <CardDescription className="text-sm">
            Connect your account with third-party services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5865F2]/10 sm:h-10 sm:w-10">
                  <DiscordLogoIcon className="h-4 w-4 text-[#5865F2] sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Discord</p>
                  <p className="mt-1 max-w-[200px] text-xs text-muted-foreground sm:max-w-none sm:text-sm">
                    {profile?.data?.user?.discordId
                      ? 'Your Discord account is connected'
                      : 'Connect your Discord account'}
                  </p>
                </div>
              </div>
              <div className=" flex w-full items-center justify-end sm:mt-0 sm:w-auto">
                {profile?.data?.user?.discordId ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    disabled={isLoading}
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ApiKeysSection />
    </div>
  );
}
