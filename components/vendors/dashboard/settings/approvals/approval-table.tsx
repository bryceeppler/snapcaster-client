import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useAdImages } from '@/hooks/queries/useAdImages';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { useVendors } from '@/hooks/queries/useVendors';
import { AD_RESOLUTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Vendor } from '@/services/vendorService';
import type {
  AdvertisementImage,
  AdvertisementWithImages
} from '@/types/advertisements';
import { AdvertisementImageType } from '@/types/advertisements';

const formatFileSize = (kilobytes: number) => {
  // if less than 1mb, return the kilobytes
  if (kilobytes < 1024 * 1024) {
    return `${(kilobytes / 1024).toFixed(2)} KB`;
  }
  return `${(kilobytes / 1024 / 1024).toFixed(2)} MB`;
};

const AdImageCard = ({
  adImage,
  ad,
  vendor
}: {
  adImage: AdvertisementImage;
  ad: AdvertisementWithImages | undefined;
  vendor: Vendor | undefined;
}) => {
  const { updateAdvertisementImage } = useAdImages();

  // Get recommended dimensions for this ad position
  const getRecommendedDimensions = () => {
    if (!ad?.position) return null;

    // For positions with image types like TOP_BANNER (desktop or mobile)
    if (ad.position in AD_RESOLUTIONS) {
      const resolutions = AD_RESOLUTIONS[ad.position];

      // Try to match with the specific image type if it exists
      if (adImage.imageType && adImage.imageType in resolutions) {
        return resolutions[adImage.imageType as keyof typeof resolutions];
      }

      // Default to DEFAULT type if specific type not found
      if (AdvertisementImageType.DEFAULT in resolutions) {
        return resolutions[AdvertisementImageType.DEFAULT];
      }

      // If there's only one type, return that
      const types = Object.keys(resolutions);
      if (types.length === 1) {
        return resolutions[types[0] as keyof typeof resolutions];
      }
    }

    return null;
  };

  const recommendedDimensions = getRecommendedDimensions();

  // Calculate aspect ratios for comparison
  const calculateAspectRatio = (width: number, height: number): number => {
    return parseFloat((width / height).toFixed(2));
  };

  const getActualAspectRatio = (): number | null => {
    if (!adImage.width || !adImage.height) return null;
    return calculateAspectRatio(adImage.width, adImage.height);
  };

  const getRecommendedAspectRatio = (): number | null => {
    if (!recommendedDimensions) return null;
    return calculateAspectRatio(
      recommendedDimensions.width,
      recommendedDimensions.height
    );
  };

  const actualAspectRatio = getActualAspectRatio();
  const recommendedAspectRatio = getRecommendedAspectRatio();

  // Check if aspect ratios match (within a small tolerance)
  const hasMatchingAspectRatio = (): boolean => {
    if (!actualAspectRatio || !recommendedAspectRatio) return false;
    // Allow a 2% tolerance for aspect ratio comparison
    const tolerance = 0.02;
    const lowerBound = recommendedAspectRatio * (1 - tolerance);
    const upperBound = recommendedAspectRatio * (1 + tolerance);
    return actualAspectRatio >= lowerBound && actualAspectRatio <= upperBound;
  };

  // Check if dimensions match the recommendation
  const hasDimensionMismatch = () => {
    if (!recommendedDimensions || !adImage.width || !adImage.height)
      return false;
    return (
      adImage.width !== recommendedDimensions.width ||
      adImage.height !== recommendedDimensions.height
    );
  };

  const dimensionMismatch = hasDimensionMismatch();
  const aspectRatioMatches = hasMatchingAspectRatio();

  const handleApproveImage = () => {
    updateAdvertisementImage.mutate({
      id: adImage.id,
      data: {
        isApproved: true
      }
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md dark:border-gray-800">
      <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="truncate text-base font-semibold sm:text-lg">
            {vendor?.name}
          </CardTitle>
          <Badge
            variant={adImage.isApproved ? 'default' : 'secondary'}
            className={cn(
              'px-2 py-1',
              adImage.isApproved
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            )}
          >
            {adImage.isApproved ? 'Approved' : 'Pending'}
          </Badge>
        </div>
        <CardDescription className="mt-1 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{ad?.position}</span>
          {adImage.imageType && (
            <span className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              {adImage.imageType}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Image and metadata container */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
          {/* Info panel - Order changed for mobile (image first, then info) */}
          <div className="order-2 col-span-1 sm:order-1 sm:col-span-5">
            <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
              {/* Resolution Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium uppercase text-muted-foreground">
                  Resolution
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Actual</span>
                    <span
                      className={cn(
                        'font-medium',
                        dimensionMismatch
                          ? aspectRatioMatches
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                          : ''
                      )}
                    >
                      {adImage.width || '—'} × {adImage.height || '—'}
                    </span>
                  </div>

                  {recommendedDimensions && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Recommended</span>
                      <span className="font-medium">
                        {recommendedDimensions.width} ×{' '}
                        {recommendedDimensions.height}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Aspect Ratio Section */}
              {actualAspectRatio && recommendedAspectRatio && (
                <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">
                    Aspect Ratio
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Actual</span>
                      <span
                        className={cn(
                          'font-medium',
                          aspectRatioMatches
                            ? ''
                            : 'text-yellow-600 dark:text-yellow-400'
                        )}
                      >
                        {actualAspectRatio}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expected</span>
                      <span
                        className={cn(
                          'font-medium',
                          aspectRatioMatches
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        )}
                      >
                        {recommendedAspectRatio}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* File Details Section */}
              <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                <h4 className="text-xs font-medium uppercase text-muted-foreground">
                  File Details
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">File Size</span>
                    <span className="font-medium">
                      {formatFileSize(adImage.fileSize) || '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-medium capitalize">
                      {adImage.fileType?.toLowerCase().replace('image/', '') ||
                        '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">
                      {adImage.createdAt
                        ? new Date(adImage.createdAt).toLocaleDateString()
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              {adImage.metadata && Object.keys(adImage.metadata).length > 0 && (
                <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <h4 className="text-xs font-medium uppercase text-muted-foreground">
                    Metadata
                  </h4>
                  <div className="space-y-1 text-sm">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex w-full items-center justify-between">
                          <span className="text-muted-foreground">
                            Additional Data
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Info className="h-3.5 w-3.5" />
                            <span className="font-medium">View Details</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs sm:max-w-sm"
                          sideOffset={5}
                          align="center"
                        >
                          <pre className="max-h-[300px] overflow-auto p-1 text-xs">
                            {JSON.stringify(adImage.metadata, null, 2)}
                          </pre>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative order-1 col-span-1 sm:order-2 sm:col-span-7">
            <div className="group relative flex h-[180px] items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900/50 sm:h-[200px]">
              <img
                src={adImage.imageUrl}
                alt={`Advertisement by ${vendor?.name}`}
                className="max-h-full max-w-full rounded object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                loading="lazy"
              />

              {/* Status indicators */}
              <div className="absolute left-0 top-0 flex flex-col gap-1 p-2">
                {adImage.fileType?.toLowerCase().includes('gif') && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Animated
                  </Badge>
                )}
              </div>

              {/* Dimension mismatch indicator */}
              {dimensionMismatch && (
                <div className="absolute bottom-2 right-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full',
                            aspectRatioMatches
                              ? 'bg-amber-100 dark:bg-amber-900/30'
                              : 'bg-yellow-100 dark:bg-yellow-900/30'
                          )}
                        >
                          <AlertTriangle
                            className={cn(
                              'h-4 w-4',
                              aspectRatioMatches
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            )}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" align="center" sideOffset={5}>
                        <div className="space-y-1 p-1">
                          <p className="text-xs font-medium">
                            Dimension mismatch
                          </p>
                          {aspectRatioMatches ? (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Correct aspect ratio (proportions)
                            </p>
                          ) : (
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                              Incorrect aspect ratio
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {!adImage.isApproved && (
        <CardFooter className="flex flex-wrap items-center justify-end gap-2 border-t bg-gray-50 p-3 px-4 dark:border-gray-800 dark:bg-gray-900/30 sm:px-6">
          {/* Only show Approve button for unapproved ads */}
          {!adImage.isApproved && (
            <Button
              size="sm"
              className="w-full bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 sm:w-auto"
              onClick={handleApproveImage}
            >
              <CheckCircle className="mr-1.5 h-4 w-4" />
              Approve
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

const ApprovalTable = () => {
  const { adImages } = useAdImages();
  const { ads } = useAdvertisements();
  const { vendors } = useVendors();
  const [_activeTab, setActiveTab] = useState<string>('pending');

  // Filter ad images based on approval status
  const pendingAdImages = adImages.filter((adImage) => !adImage.isApproved);
  const activeAdImages = adImages.filter((adImage) => adImage.isApproved);

  // Count ads with dimension mismatches
  const getMismatchCount = (adImagesList: AdvertisementImage[]) => {
    return adImagesList.filter((adImage) => {
      const ad = ads.find((ad) => ad.id === adImage.advertisementId);
      if (!ad?.position || !(ad.position in AD_RESOLUTIONS)) return false;

      const resolutions = AD_RESOLUTIONS[ad.position];
      let recommendedDimensions = null;

      // Find the applicable dimensions
      if (adImage.imageType && adImage.imageType in resolutions) {
        recommendedDimensions =
          resolutions[adImage.imageType as keyof typeof resolutions];
      } else if (AdvertisementImageType.DEFAULT in resolutions) {
        recommendedDimensions = resolutions[AdvertisementImageType.DEFAULT];
      } else {
        const types = Object.keys(resolutions);
        if (types.length === 1) {
          recommendedDimensions =
            resolutions[types[0] as keyof typeof resolutions];
        }
      }

      // Check for dimension mismatch
      if (!recommendedDimensions || !adImage.width || !adImage.height)
        return false;

      // Count as mismatch only if resolution AND aspect ratio don't match
      if (
        adImage.width !== recommendedDimensions.width ||
        adImage.height !== recommendedDimensions.height
      ) {
        // Calculate aspect ratios
        const actualRatio = parseFloat(
          (adImage.width / adImage.height).toFixed(2)
        );
        const recommendedRatio = parseFloat(
          (recommendedDimensions.width / recommendedDimensions.height).toFixed(
            2
          )
        );

        // Allow a 2% tolerance for aspect ratio comparison
        const tolerance = 0.02;
        const lowerBound = recommendedRatio * (1 - tolerance);
        const upperBound = recommendedRatio * (1 + tolerance);

        // Only count as a warning if the aspect ratio doesn't match
        return !(actualRatio >= lowerBound && actualRatio <= upperBound);
      }

      return false;
    }).length;
  };

  const activeMismatchCount = getMismatchCount(activeAdImages);

  return (
    <Tabs
      defaultValue="pending"
      className="w-full"
      onValueChange={setActiveTab}
    >
      <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
        <TabsTrigger value="pending">
          Pending
          {pendingAdImages.length > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-orange-800 dark:text-orange-200">
              {pendingAdImages.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="active">
          Active
          {activeAdImages.length > 0 && (
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
              {activeAdImages.length}
            </span>
          )}
          {activeMismatchCount > 0 && (
            <span className="ml-1 flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-300">
              <AlertTriangle className="h-3 w-3" />
              {activeMismatchCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-6">
        {pendingAdImages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                New advertisements will appear here when vendors submit them.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {pendingAdImages.map((adImage) => {
              const ad = ads.find((ad) => ad.id === adImage.advertisementId);
              const vendor = vendors.find(
                (vendor) => vendor.id === ad?.vendorId
              );
              return (
                <AdImageCard
                  key={adImage.id}
                  adImage={adImage}
                  ad={ad}
                  vendor={vendor}
                />
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="active" className="mt-6">
        {activeAdImages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                Approved advertisements will appear here.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {activeAdImages.map((adImage) => {
              const ad = ads.find((ad) => ad.id === adImage.advertisementId);
              const vendor = vendors.find(
                (vendor) => vendor.id === ad?.vendorId
              );
              return (
                <AdImageCard
                  key={adImage.id}
                  adImage={adImage}
                  ad={ad}
                  vendor={vendor}
                />
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ApprovalTable;
