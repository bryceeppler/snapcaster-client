'use client';

import { Key, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ApiKeyList } from './api-keys/api-key-list';
import { CreateApiKeyDialog } from './api-keys/create-api-key-dialog';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useUserApiKeys } from '@/hooks/queries/useUserApiKeys';

export function ApiKeysSection() {
  const { apiKeys, isLoading, newlyCreatedKey, clearNewlyCreatedKey } =
    useUserApiKeys();
  const [copied, setCopied] = useState(false);

  const handleCopyNewKey = async () => {
    if (!newlyCreatedKey) return;
    
    try {
      await navigator.clipboard.writeText(newlyCreatedKey);
      setCopied(true);
      toast.success('API key copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">API Keys</CardTitle>
          <CardDescription className="text-sm">
            Manage your API keys for programmatic access to Snapcaster.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl">API Keys</CardTitle>
            <CardDescription className="text-sm">
              Manage your API keys for programmatic access to Snapcaster.
            </CardDescription>
          </div>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Key className="h-4 w-4 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {apiKeys.length === 0
                ? 'No API keys created yet.'
                : `${apiKeys.length} API ${
                    apiKeys.length === 1 ? 'key' : 'keys'
                  } created`}
            </p>
            <CreateApiKeyDialog />
          </div>

          {newlyCreatedKey && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
                New API Key Created
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="block flex-1 break-all rounded border bg-white p-2 text-xs dark:bg-gray-900">
                    {newlyCreatedKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={handleCopyNewKey}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Save this key securely. You can reveal it later from the menu.
                </p>
              </div>
              <button
                onClick={clearNewlyCreatedKey}
                className="mt-3 text-xs text-green-700 underline hover:no-underline dark:text-green-300"
              >
                I've saved this key
              </button>
            </div>
          )}

          {apiKeys.length > 0 && <ApiKeyList apiKeys={apiKeys} />}
        </div>
      </CardContent>
    </Card>
  );
}
