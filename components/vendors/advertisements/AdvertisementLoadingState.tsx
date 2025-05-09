import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AdvertisementLoadingStateProps {
  onBack: () => void;
}

export function AdvertisementLoadingState({
  onBack
}: AdvertisementLoadingStateProps) {
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
          <h3 className="mt-6 text-lg font-medium">Loading advertisement...</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Please wait while we fetch your advertisement details.
          </p>
        </div>
      </div>
    </div>
  );
}
