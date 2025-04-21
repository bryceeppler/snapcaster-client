import { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Link,
  Hash,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
  const [copiedImageId, setCopiedImageId] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

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

  const copyImageUrlToClipboard = (imageUrl: string, imageId: number) => {
    navigator.clipboard.writeText(imageUrl);
    setCopiedImageId(imageId);
    toast.success('Image URL copied to clipboard!');

    // Reset the copied state after a delay
    setTimeout(() => {
      setCopiedImageId(null);
    }, 2000);
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteConfirm = async () => {
    if (imageToDelete !== null) {
      await onDeleteImage(imageToDelete);
      setImageToDelete(null);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border border-border/40 shadow-sm transition-all hover:border-border/60 dark:border-border/20 dark:hover:border-border/30">
      <CardHeader className="flex flex-col gap-2 border-b bg-card/50 px-4 py-3 md:px-5">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ImageIcon className="h-3.5 w-3.5" />
            </div>
            <CardTitle className="text-sm font-medium lg:text-base">
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
                className="h-7 gap-1 text-xs lg:h-8"
              >
                <Plus className="h-3 w-3" />
                <span>Add</span>
              </Button>
            )}
          />
        </div>

        {showTopBannerWarning && (
          <Alert variant="destructive" className="mt-2">
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
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              At least one image is required for this advertisement.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-grow overflow-auto p-0">
        {advertisement.images.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">No images yet</h3>
            <p className="mt-1.5 max-w-[220px] text-center text-xs text-muted-foreground">
              Add images to make your ad more engaging and increase visibility
            </p>
            <Button
              className="mt-5 h-9 text-xs"
              onClick={() => setIsImageDialogOpen(true)}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Image
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            <div className="divide-y divide-border/40">
              {advertisement.images.map((image) => (
                <div
                  key={image.id}
                  className="group relative flex items-start justify-between gap-4 p-4 transition-colors hover:bg-muted/30 lg:px-5"
                >
                  <div className="flex flex-1 space-x-4">
                    <div
                      className="group/image relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border bg-muted/50 lg:h-24 lg:w-24"
                      onClick={() => openImageInNewTab(image.image_url)}
                    >
                      <img
                        src={image.image_url}
                        alt={`${advertisement.alt_text || 'Advertisement'} - ${
                          image.image_type
                        }`}
                        className="h-full w-full object-contain transition-all group-hover/image:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/image:opacity-100">
                        <ExternalLink className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {image.image_type}
                        </Badge>

                        <span className="text-xs text-muted-foreground">
                          Added {format(image.created_at, 'MMM d, yyyy')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Hash className="h-3 w-3 text-slate-500" />
                          </div>
                          <span className="text-xs font-medium">Image ID:</span>
                          <span className="text-xs text-muted-foreground">
                            {image.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 truncate">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Link className="h-3 w-3 text-slate-500" />
                          </div>
                          <span className="flex-shrink-0 text-xs font-medium">
                            URL:
                          </span>
                          <button
                            onClick={() =>
                              copyImageUrlToClipboard(image.image_url, image.id)
                            }
                            className="group/copy flex max-w-[calc(100%-70px)] items-center gap-1.5 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            aria-label={`Copy image URL: ${image.image_url}`}
                          >
                            <span className="cursor-pointer truncate text-xs text-slate-500 transition-colors group-hover/copy:text-primary">
                              {image.image_url}
                            </span>
                            {copiedImageId === image.id ? (
                              <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/copy:opacity-100" />
                            )}
                          </button>
                        </div>
                        {!image.is_active && (
                          <Alert
                            variant="default"
                            className="w-fit border-yellow-500 bg-yellow-500/20"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-xs">
                              Pending Admin Approval
                            </AlertTitle>
                            <AlertDescription className="hidden text-xs md:block">
                              Please allow up to 24 hours for your image to be
                              approved.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setImageToDelete(image.id)}
                          disabled={isLoading}
                          className="h-8 w-8 p-0 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 dark:hover:bg-red-950/50 md:opacity-0 md:group-hover:opacity-100"
                          aria-label={`Delete image ${image.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-xs">Delete image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
        {advertisement.images.length > 0 && (
          <div className="flex justify-center border-t border-border/40 p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsImageDialogOpen(true)}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add another image
            </Button>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => !open && setImageToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
