'use client';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

import { CreateApiKeyDialog } from './create-api-key-dialog';

import { Button } from '@/components/ui/button';


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
