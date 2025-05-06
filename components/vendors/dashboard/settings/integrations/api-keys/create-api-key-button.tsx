'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateApiKeyDialog } from './create-api-key-dialog';

export function CreateApiKeyButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create API Key
      </Button>

      <CreateApiKeyDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}
