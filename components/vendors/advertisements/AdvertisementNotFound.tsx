import { ArrowLeft, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AdvertisementNotFoundProps {
  onBack: () => void;
}

export function AdvertisementNotFound({ onBack }: AdvertisementNotFoundProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Advertisements
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mt-6 text-lg font-medium">Advertisement not found</h3>
          <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
            We couldn't find the advertisement you're looking for. It may have
            been deleted or you may not have permission to view it.
          </p>
          <Button className="mt-6" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Advertisements
          </Button>
        </div>
      </div>
    </div>
  );
}
