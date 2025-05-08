'use client';
import { Check, Copy } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiKeys } from '@/hooks/queries/useApiKeys';

interface CreateApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateApiKeyDialog({ open, onClose }: CreateApiKeyDialogProps) {
  const { createApiKey, isCreating } = useApiKeys();
  const [step, setStep] = useState<'form' | 'created'>('form');
  const [keyName, setKeyName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyName.trim()) {
      toast.error('Please enter a name for your API key.');
      return;
    }

    createApiKey(
      { name: keyName.trim() },
      {
        onSuccess: (data) => {
          setNewKey(data.key);
          setStep('created');
        }
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(newKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleClose = () => {
    setStep('form');
    setKeyName('');
    setNewKey('');
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access your account programmatically.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., SortSwift API Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Give your API key a descriptive name to identify its purpose.
                </p>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleClose}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create API Key'}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Your new API key has been created. Copy it now as it won't be
                shown again.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    readOnly
                    value={newKey}
                    className="truncate pr-8 font-mono text-sm "
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-6"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
                <p className="text-sm font-medium text-destructive">
                  This key will only be displayed once and cannot be retrieved
                  later.
                </p>
              </div>

              <DialogFooter>
                <Button onClick={handleClose}>Done</Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
