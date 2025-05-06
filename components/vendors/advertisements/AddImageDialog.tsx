import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, useEffect } from 'react';
import {
  useAdvertisements,
  QUERY_KEY
} from '@/hooks/queries/useAdvertisements';
import { useQueryClient } from '@tanstack/react-query';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  AdvertisementImageType
} from '@/types/advertisements';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AD_RESOLUTIONS } from '@/lib/constants';
import { advertisementService } from '@/services/advertisementService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
  UploadIcon,
  ImageIcon,
  XCircleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  InfoIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Form schema for image upload
const imageFormSchema = z.object({
  image: z
    .instanceof(File, {
      message: 'Please select an image file.'
    })
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file.type
        ),
      {
        message:
          'Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.'
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB.'
    }),
  image_type: z.nativeEnum(AdvertisementImageType)
});

export type ImageFormValues = z.infer<typeof imageFormSchema>;

interface AddImageDialogProps {
  advertisement: AdvertisementWithImages;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  addButtonRenderer: (onClick: () => void) => React.ReactNode;
}

interface ImageMetadata {
  dimensions: { width: number; height: number } | null;
  size: string;
  type: string;
}

interface Resolution {
  width: number;
  height: number;
}

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function AddImageDialog({
  advertisement,
  isOpen,
  onOpenChange,
  addButtonRenderer
}: AddImageDialogProps) {
  const { fetchAdvertisementById } = useAdvertisements();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [fileMetadata, setFileMetadata] = useState<ImageMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get vendor information from profile
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;

  // Check if this ad position allows multiple image types
  const allowsMultipleImageTypes =
    advertisement.position === AdvertisementPosition.TOP_BANNER;

  const imageForm = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      image_type: AdvertisementImageType.DEFAULT
    }
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFileName('');
      setFileMetadata(null);
      setUploadProgress(0);
      setIsUploading(false);

      // Set appropriate default image type based on position
      const defaultImageType =
        advertisement.position === AdvertisementPosition.TOP_BANNER
          ? AdvertisementImageType.DESKTOP
          : AdvertisementImageType.DEFAULT;

      imageForm.reset({
        image_type: defaultImageType
      });
    }
  }, [isOpen, imageForm, advertisement.position]);

  // Set image type based on advertisement position
  useEffect(() => {
    if (!allowsMultipleImageTypes) {
      imageForm.setValue('image_type', AdvertisementImageType.DEFAULT);
    } else {
      // For TOP_BANNER, set DESKTOP as default if not already set to MOBILE
      if (
        advertisement.position === AdvertisementPosition.TOP_BANNER &&
        imageForm.getValues('image_type') === AdvertisementImageType.DEFAULT
      ) {
        imageForm.setValue('image_type', AdvertisementImageType.DESKTOP);
      }
    }
  }, [advertisement.position, allowsMultipleImageTypes, imageForm]);

  // Get the selected image type
  const selectedImageType = imageForm.watch('image_type');

  // Get recommended resolution for current position and image type
  const getRecommendedResolution = (): Resolution | null => {
    const position = advertisement.position;

    // Check if this position has any resolutions defined
    const positionResolutions = AD_RESOLUTIONS[position];
    if (!positionResolutions) {
      return null;
    }

    // Try to get the resolution for the selected image type
    const imageTypeRes =
      positionResolutions[
        selectedImageType as keyof typeof positionResolutions
      ];
    if (imageTypeRes) {
      return imageTypeRes as Resolution;
    }

    // Fall back to DEFAULT if available
    const defaultRes =
      positionResolutions[
        AdvertisementImageType.DEFAULT as keyof typeof positionResolutions
      ];
    if (defaultRes) {
      return defaultRes as Resolution;
    }

    return null;
  };

  // Check if dimensions match recommended resolution
  const checkDimensionsMatch = () => {
    if (!fileMetadata?.dimensions) return null;

    const recommendedResolution = getRecommendedResolution();
    if (!recommendedResolution) return null;

    const { width, height } = fileMetadata.dimensions;
    const { width: recWidth, height: recHeight } = recommendedResolution;

    const widthMatch = width === recWidth;
    const heightMatch = height === recHeight;

    return {
      match: widthMatch && heightMatch,
      widthMatch,
      heightMatch
    };
  };

  const dimensionsCheck = fileMetadata?.dimensions
    ? checkDimensionsMatch()
    : null;

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number } | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src); // Clean up
      };
      img.onerror = () => {
        resolve(null);
        URL.revokeObjectURL(img.src); // Clean up
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      imageForm.setValue('image', file, {
        shouldValidate: true
      });
      setFileName(file.name);

      // Get and set file metadata
      const dimensions = await getImageDimensions(file);
      const metadata: ImageMetadata = {
        dimensions,
        size: formatFileSize(file.size),
        type: file.type.replace('image/', '').toUpperCase()
      };
      setFileMetadata(metadata);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setFileName('');
    setFileMetadata(null);
    imageForm.resetField('image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate upload progress
  const simulateProgress = () => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const onImageSubmit = async (values: ImageFormValues) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Start progress simulation
      const clearProgressInterval = simulateProgress();

      // 1. Request a presigned URL from the backend
      const presignedUrlResponse =
        await advertisementService.requestPresignedUrl(advertisement.id, {
          fileType: values.image.type,
          fileName: values.image.name,
          imageType: values.image_type
        });

      // 2. Upload the image directly to S3 using the presigned URL
      const uploadResponse = await advertisementService.uploadImageToS3(
        presignedUrlResponse.presignedUrl,
        values.image
      );

      // Force progress to 100% when done
      setUploadProgress(100);
      clearProgressInterval();

      // 3. Confirm the upload to the backend
      await advertisementService.confirmImageUpload(advertisement.id, {
        publicUrl: presignedUrlResponse.publicUrl,
        imageType: values.image_type,
        isActive: true,
        width: uploadResponse.width,
        height: uploadResponse.height,
        fileSize: uploadResponse.fileSize,
        fileType: uploadResponse.fileType,
        metadata: {}
      });

      // 4. Invalidate advertisements query to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

      toast.success('Image uploaded successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // Get resolution info card for the dialog description
  const getResolutionInfo = (position: AdvertisementPosition) => {
    // Skip if no resolutions defined for this position
    const positionResolutions = AD_RESOLUTIONS[position];
    if (!positionResolutions) {
      return null;
    }

    // Convert the resolution object to an array of entries with proper typing
    const resolutionEntries: [string, Resolution][] = [];

    // Iterate through the keys safely
    Object.keys(positionResolutions).forEach((key) => {
      const value =
        positionResolutions[key as keyof typeof positionResolutions];
      if (
        value &&
        typeof value === 'object' &&
        'width' in value &&
        'height' in value
      ) {
        resolutionEntries.push([key, value as Resolution]);
      }
    });

    if (resolutionEntries.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 space-y-1.5 rounded-md border border-border bg-muted/30 p-2.5">
        <div className="flex items-start gap-2">
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          <div>
            <h4 className="text-xs font-medium">Recommended Resolutions</h4>
            <div className="mt-1.5 space-y-1">
              {resolutionEntries.map(([type, res]) => (
                <div key={type} className="text-[11px] text-muted-foreground">
                  {type !== AdvertisementImageType.DEFAULT && (
                    <span className="font-medium">{type}: </span>
                  )}
                  <span>
                    {res.width} × {res.height}px
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {addButtonRenderer(() => onOpenChange(true))}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] p-4 sm:max-w-[425px] md:p-5">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base">Upload Image</DialogTitle>
          <DialogDescription className="text-xs">
            {getResolutionInfo(advertisement.position)}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={imageForm.handleSubmit(onImageSubmit)}
          className="space-y-4 pt-2"
        >
          {/* File Input Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="image" className="text-xs font-medium">
                Image File
              </Label>
              {fileMetadata && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px] text-muted-foreground"
                  onClick={clearFile}
                >
                  <XCircleIcon className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {!fileName ? (
                // Empty state with file drop zone
                (<div
                  role="button"
                  tabIndex={0}
                  onClick={triggerFileInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      triggerFileInput();
                    }
                  }}
                  className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-3 py-4 text-center transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-label="Click to upload an image"
                >
                  <UploadIcon className="mb-1.5 h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Click to upload
                  </span>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">
                    JPEG, PNG, GIF, WebP up to 5MB
                  </span>
                </div>)
              ) : (
                // File metadata display
                (<div className="rounded-md border border-border bg-muted/10 p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-medium text-foreground">
                          {fileName}
                        </p>
                        <button
                          type="button"
                          onClick={clearFile}
                          className="flex-shrink-0 rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          aria-label="Remove file"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                        <div className="flex items-center">
                          <span className="font-medium text-muted-foreground">
                            Size:
                          </span>
                          <span className="ml-1 text-foreground">
                            {fileMetadata?.size}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-muted-foreground">
                            Type:
                          </span>
                          <span className="ml-1 text-foreground">
                            {fileMetadata?.type}
                          </span>
                        </div>

                        {fileMetadata?.dimensions && (
                          <div className="flex items-center">
                            <span className="font-medium text-muted-foreground">
                              Dimensions:
                            </span>
                            <span className="group ml-1 flex items-center gap-1">
                              <span
                                className={cn(
                                  'text-foreground',
                                  dimensionsCheck?.match === false &&
                                    'text-amber-500'
                                )}
                              >
                                {fileMetadata.dimensions.width} ×{' '}
                                {fileMetadata.dimensions.height}px
                              </span>

                              {dimensionsCheck?.match === true && (
                                <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-500" />
                              )}

                              {dimensionsCheck?.match === false && (
                                <AlertCircleIcon className="h-3.5 w-3.5 text-amber-500" />
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {dimensionsCheck?.match === false &&
                        getRecommendedResolution() && (
                          <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400">
                            <p>
                              Recommended: {getRecommendedResolution()!.width} ×{' '}
                              {getRecommendedResolution()!.height}px
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>)
              )}

              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="sr-only"
                onChange={handleFileChange}
                aria-label="Upload image file"
              />
            </div>

            {imageForm.formState.errors.image && (
              <p className="text-xs font-medium text-destructive">
                {imageForm.formState.errors.image.message}
              </p>
            )}
          </div>

          {/* Image Type Selection - Only for TOP_BANNER */}
          {allowsMultipleImageTypes && (
            <div className="space-y-1.5">
              <Label htmlFor="image_type" className="text-xs font-medium">
                Image Type
              </Label>
              <Controller
                control={imageForm.control}
                name="image_type"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="image_type"
                      className="h-9 text-sm"
                      aria-label="Select image type"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AdvertisementImageType)
                        .filter((type) =>
                          advertisement.position ===
                          AdvertisementPosition.TOP_BANNER
                            ? type === AdvertisementImageType.MOBILE ||
                              type === AdvertisementImageType.DESKTOP
                            : true
                        )
                        .map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="text-sm"
                          >
                            {type}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {imageForm.formState.errors.image_type && (
                <p className="text-xs font-medium text-destructive">
                  {imageForm.formState.errors.image_type.message}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground">
                {advertisement.position === AdvertisementPosition.TOP_BANNER
                  ? 'MOBILE for small screens, DESKTOP for larger screens.'
                  : 'DEFAULT is used for all screen sizes.'}
              </p>
            </div>
          )}

          {/* Progress Bar - Only visible during upload */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Uploading...
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 flex-1 text-sm sm:flex-none"
                disabled={isUploading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isUploading || !fileName}
              className="h-9 flex-1 text-sm sm:flex-none"
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
