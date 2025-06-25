'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserApiKeys } from '@/hooks/queries/useUserApiKeys';

export function CreateApiKeyDialog() {
  const { createApiKey, isCreating } = useUserApiKeys();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [scopes, setScopes] = useState<string[]>(['read', 'write']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expirationDays = expiresIn === 'never' ? undefined : parseInt(expiresIn);
    
    createApiKey(
      {
        name,
        scopes,
        expiresIn: expirationDays,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
          setExpiresIn('never');
          setScopes(['read', 'write']);
        },
      }
    );
  };

  const toggleScope = (scope: string) => {
    setScopes((prev) =>
      prev.includes(scope)
        ? prev.filter((s) => s !== scope)
        : [...prev, scope]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access to your Snapcaster account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="My API Key"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expires" className="text-right">
                Expires
              </Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">Permissions</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="read"
                    checked={scopes.includes('read')}
                    onCheckedChange={() => toggleScope('read')}
                  />
                  <label
                    htmlFor="read"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Read access
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="write"
                    checked={scopes.includes('write')}
                    onCheckedChange={() => toggleScope('write')}
                  />
                  <label
                    htmlFor="write"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Write access
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating || !name || scopes.length === 0}>
              {isCreating ? 'Creating...' : 'Create Key'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}