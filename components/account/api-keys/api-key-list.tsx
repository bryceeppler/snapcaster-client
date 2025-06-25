'use client';

import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal, Trash2, Eye, Copy, Check } from 'lucide-react';
import { ApiKey, apiKeyService } from '@/services/apiKeyService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserApiKeys } from '@/hooks/queries/useUserApiKeys';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface ApiKeyListProps {
  apiKeys: ApiKey[];
}

export function ApiKeyList({ apiKeys }: ApiKeyListProps) {
  const { revokeApiKey, isRevoking } = useUserApiKeys();
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [loadingReveal, setLoadingReveal] = useState<string | null>(null);
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({});

  const handleRevoke = () => {
    if (keyToRevoke) {
      revokeApiKey(keyToRevoke.id);
      setKeyToRevoke(null);
    }
  };

  const handleRevealKey = async (apiKeyId: string) => {
    if (revealedKeys[apiKeyId]) {
      // Already revealed, just hide it
      setRevealedKeys((prev) => {
        const newState = { ...prev };
        delete newState[apiKeyId];
        return newState;
      });
      return;
    }

    setLoadingReveal(apiKeyId);
    try {
      const result = await apiKeyService.revealApiKey(apiKeyId);
      setRevealedKeys((prev) => ({ ...prev, [apiKeyId]: result.key }));
    } catch (error) {
      toast.error('Failed to reveal API key', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setLoadingReveal(null);
    }
  };

  const handleCopyKey = async (key: string, apiKeyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeys((prev) => ({ ...prev, [apiKeyId]: true }));
      toast.success('API key copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedKeys((prev) => {
          const newState = { ...prev };
          delete newState[apiKeyId];
          return newState;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy API key');
    }
  };

  return (
    <>
      <div className="space-y-2">
        {apiKeys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{apiKey.name}</p>
                {!revealedKeys[apiKey.id] && (
                  <code className="text-xs text-muted-foreground">
                    {apiKey.keyPrefix}...
                  </code>
                )}
              </div>
              {revealedKeys[apiKey.id] && (
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs text-muted-foreground font-mono break-all bg-muted px-2 py-1 rounded">
                    {revealedKeys[apiKey.id]}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={() => handleCopyKey(revealedKeys[apiKey.id], apiKey.id)}
                  >
                    {copiedKeys[apiKey.id] ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  Created {formatDistanceToNow(new Date(apiKey.createdAt), { addSuffix: true })}
                </span>
                {apiKey.lastUsedAt && (
                  <span>
                    Last used {formatDistanceToNow(new Date(apiKey.lastUsedAt), { addSuffix: true })}
                  </span>
                )}
                {apiKey.expiresAt && (
                  <span className="text-orange-600 dark:text-orange-400">
                    Expires {formatDistanceToNow(new Date(apiKey.expiresAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {apiKey.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleRevealKey(apiKey.id)}
                  disabled={loadingReveal === apiKey.id}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {revealedKeys[apiKey.id] ? 'Hide key' : 'Reveal key'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setKeyToRevoke(apiKey)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Revoke key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <AlertDialog open={!!keyToRevoke} onOpenChange={() => setKeyToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the API key "{keyToRevoke?.name}"? This action cannot
              be undone and any applications using this key will immediately lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? 'Revoking...' : 'Revoke Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}