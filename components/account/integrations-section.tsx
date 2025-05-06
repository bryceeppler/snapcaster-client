'use client';

import { useState } from 'react';
import { DiscordLogoIcon } from '@radix-ui/react-icons';

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

export function IntegrationsSection() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      toast({
        title: 'Discord connected',
        description: 'Your Discord account has been successfully connected.'
      });
    }, 1000);
  };

  const handleDisconnect = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(false);
      toast({
        title: 'Discord disconnected',
        description: 'Your Discord account has been disconnected.'
      });
    }, 1000);
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
                  {isConnected
                    ? 'Your Discord account is connected'
                    : 'Connect your Discord account'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Switch checked={isConnected} disabled />
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
