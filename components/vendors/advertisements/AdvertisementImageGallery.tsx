import { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  AdvertisementPosition,
  AdvertisementImageType,
  AdvertisementWithImages
} from '@/types/advertisements';
import { AddImageDialog } from './AddImageDialog';
import { AD_DIMENSIONS } from '@/components/ads/AdManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AdvertisementImageGalleryProps {
  advertisement: AdvertisementWithImages;
  onDeleteImage: (imageId: number) => Promise<void>;
  isLoading: boolean;
}

export function AdvertisementImageGallery({
  advertisement,
  onDeleteImage,
  isLoading
}: AdvertisementImageGalleryProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const hasMobileImage = advertisement.images.some(
    (img) => img.image_type === AdvertisementImageType.MOBILE
  );

  const hasDesktopImage = advertisement.images.some(
    (img) => img.image_type === AdvertisementImageType.DESKTOP
  );

  const isTopBanner =
    advertisement.position === AdvertisementPosition.TOP_BANNER;

  const showTopBannerWarning =
    isTopBanner && (!hasMobileImage || !hasDesktopImage);
  const showGeneralWarning = !isTopBanner && advertisement.images.length === 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden border-0 shadow-sm">
      <CardHeader className="flex flex-col gap-2 border-b">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <CardTitle className="text-sm font-medium md:text-base">
              Images
            </CardTitle>
          </div>

          <AddImageDialog
            advertisement={advertisement}
            isOpen={isImageDialogOpen}
            onOpenChange={setIsImageDialogOpen}
            addButtonRenderer={(onClick: () => void) => (
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
                className="h-7 gap-1 text-xs md:h-8"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </Button>
            )}
          />
        </div>

        {showTopBannerWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              {!hasMobileImage && !hasDesktopImage
                ? 'You need both mobile and desktop images for top banners.'
                : !hasMobileImage
                ? 'A mobile image is required for top banners.'
                : 'A desktop image is required for top banners.'}
            </AlertDescription>
          </Alert>
        )}

        {showGeneralWarning && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              At least one image is required for this advertisement.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-grow overflow-auto p-4 md:px-5">
        {advertisement.images.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/70">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 text-sm font-medium">No images yet</h3>
            <p className="mt-1 max-w-[200px] text-center text-xs text-muted-foreground">
              Add images to make your ad more engaging
            </p>
            <Button
              className="mt-4 h-8 text-xs"
              onClick={() => setIsImageDialogOpen(true)}
            >
              <Plus className="mr-1.5 h-3 w-3" />
              Add Image
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-muted/60">
              {advertisement.images.map((image) => (
                <div
                  key={image.id}
                  className="group flex items-start justify-between gap-2 py-3 first:pt-0"
                >
                  <div className="flex space-x-2">
                    <div className="relative h-14 w-14 overflow-hidden rounded-md border bg-muted/50">
                      <img
                        src={image.image_url}
                        alt={`${advertisement.alt_text} - ${image.image_type}`}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                          {image.image_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteImage(image.id)}
                    disabled={isLoading}
                    className="h-6 w-6 p-0 text-muted-foreground opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
