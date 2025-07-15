'use client';

import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  AlertCircle,
  KeyRound,
  Loader2,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

import { DeleteApiKeyDialog } from './delete-api-key-dialog';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { ApiKey } from '@/hooks/queries/useApiKeys';
import { useApiKeys } from '@/hooks/queries/useApiKeys';

// Loading skeleton for the table
const TableLoadingSkeleton = () => (
  <div className="w-full space-y-2 p-4">
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="ml-auto h-8 w-8" />
        </div>
      ))}
    </div>
  </div>
);

// Mobile card component for API keys
const MobileApiKeyCard = ({
  apiKey,
  onDelete,
  isDeleting
}: {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group border-b p-4 transition-colors hover:bg-muted/50"
      role="region"
      aria-expanded={expanded}
    >
      {/* Main card content - always visible */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{apiKey.name}</p>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Created {formatDistanceToNow(parseISO(apiKey.created_at))} ago
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less details' : 'Show more details'}
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Expandable section - only visible when expanded */}
      {expanded && (
        <div className="mt-3 rounded-md bg-muted/30 p-3">
          {/* Last used information */}
          <div className="mb-3 text-xs text-muted-foreground">
            {apiKey.last_used_at ? (
              <div>
                Last used: {formatDistanceToNow(parseISO(apiKey.last_used_at))}{' '}
                ago
              </div>
            ) : (
              <div>Never used</div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(apiKey.id)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              {isDeleting ? 'Revoking...' : 'Revoke Key'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export function ApiKeyList() {
  const { apiKeys, isLoading, isError, deleteApiKey, isDeleting } =
    useApiKeys();
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  const handleDeleteKey = (id: string) => {
    deleteApiKey(id);
    setKeyToDelete(null);
  };

  // Empty state component
  const ApiKeyEmptyState = () => (
    <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <KeyRound className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No API keys</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        You haven't created any API keys yet.
      </p>
    </div>
  );

  // Error state component
  const ApiKeyErrorState = () => (
    <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Error loading API keys</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        There was an error loading your API keys. Please try again later.
      </p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Try again
      </Button>
    </div>
  );

  if (isError) {
    return <ApiKeyErrorState />;
  }

  return (
    <>
      {/* Mobile view */}
      <section
        className="rounded-md border md:hidden"
        aria-labelledby="mobile-apikeys-heading"
      >
        <h2 id="mobile-apikeys-heading" className="sr-only">
          API Keys List
        </h2>
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Loading API keys...
              </p>
            </div>
          </div>
        ) : apiKeys.length === 0 ? (
          <ApiKeyEmptyState />
        ) : (
          <div className="divide-y rounded-lg border" role="list">
            {apiKeys.map((apiKey) => (
              <MobileApiKeyCard
                key={apiKey.id}
                apiKey={apiKey}
                onDelete={(id) => {
                  setKeyToDelete(apiKeys.find((key) => key.id === id) || null);
                }}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </section>

      {/* Desktop view table */}
      <section
        className="hidden rounded-md border md:block"
        aria-labelledby="desktop-apikeys-heading"
      >
        <h2 id="desktop-apikeys-heading" className="sr-only">
          API Keys Table
        </h2>
        <Table className="hidden rounded-md bg-card md:table">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted">
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <TableLoadingSkeleton />
                </TableCell>
              </TableRow>
            ) : apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <KeyRound className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No API keys found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{apiKey.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(parseISO(apiKey.created_at))} ago
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {apiKey.last_used_at
                      ? `${formatDistanceToNow(
                          parseISO(apiKey.last_used_at)
                        )} ago`
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex h-8 w-8 items-center justify-center p-0 opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
                            aria-label="Actions for API key"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setKeyToDelete(apiKey)}
                            disabled={isDeleting}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setKeyToDelete(apiKey);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Revoke key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      <DeleteApiKeyDialog
        open={!!keyToDelete}
        apiKey={keyToDelete}
        onClose={() => setKeyToDelete(null)}
        onConfirm={() => keyToDelete && handleDeleteKey(keyToDelete.id)}
      />
    </>
  );
}
