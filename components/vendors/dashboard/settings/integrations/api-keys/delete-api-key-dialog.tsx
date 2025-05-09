'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import type { ApiKey } from '@/hooks/queries/useApiKeys';
import { useApiKeys } from '@/hooks/queries/useApiKeys';

interface DeleteApiKeyDialogProps {
  open: boolean;
  apiKey: ApiKey | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteApiKeyDialog({
  open,
  apiKey,
  onClose,
  onConfirm
}: DeleteApiKeyDialogProps) {
  const { isDeleting } = useApiKeys();

  if (!apiKey) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke the API key "{apiKey.name}"? This
            action cannot be undone and any applications using this key will
            immediately lose access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? 'Revoking...' : 'Revoke Key'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
