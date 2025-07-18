import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Image as ImageIcon,
  Link as LinkIcon,
  MoreHorizontal,
  Pencil,
  Store
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import DashboardLayout from '../layout';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import type { AdvertisementWithImages } from '@/types/advertisements';
import { AdvertisementPosition } from '@/types/advertisements';

export const AD_DIMENSIONS = {
  topBanner: {
    mobile: {
      width: 382,
      height: 160,
      aspectRatio: '382/160'
    },
    desktop: {
      width: 1008,
      height: 160,
      aspectRatio: '1008/160'
    }
  },
  sideBanner: {
    width: 160,
    height: 480,
    aspectRatio: '160/480'
  }
} as const;

// Form schema for advertisement validation
const advertisementFormSchema = z.object({
  targetUrl: z.string().url({
    message: 'Please enter a valid URL.'
  }),
  position: z.nativeEnum(AdvertisementPosition),
  altText: z.string().min(3, {
    message: 'Alt text must be at least 3 characters.'
  }),
  startDate: z.date(),
  endDate: z.date().nullable().optional()
});

type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

// Create a memoized component for individual advertisement rows
const AdvertisementRow = memo(
  ({
    ad,
    onToggleStatus,
    onNavigateToDetails,
    isLoading,
    isAdmin,
    getVendorName
  }: {
    ad: AdvertisementWithImages;
    onEdit: (ad: AdvertisementWithImages) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (ad: AdvertisementWithImages, status: boolean) => void;
    onNavigateToDetails: (id: number) => void;
    isLoading: boolean;
    isAdmin: boolean;
    getVendorName: (vendorId: number) => string;
  }) => {
    return (
      <TableRow key={ad.id} className="group">
        <TableCell className="hidden font-medium md:table-cell">
          <div className="flex items-center gap-2">
            {ad.position.replace('_', ' ')}
          </div>
        </TableCell>
        {isAdmin && (
          <TableCell className="hidden text-muted-foreground md:table-cell">
            <div className="flex items-center gap-2">
              {getVendorName(ad.vendorId)}
            </div>
          </TableCell>
        )}
        <TableCell className="max-w-[200px]">
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary hover:underline"
          >
            <LinkIcon className="mr-1 h-3 w-3 min-w-[12px] flex-shrink-0" />
            <span className="truncate">{ad.targetUrl}</span>
          </a>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <div className="flex items-center">
            <span
              className={`mr-2 rounded-full px-2 py-1 text-xs ${
                ad.images.length > 0
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              {ad.images.length} {ad.images.length === 1 ? 'image' : 'images'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Switch
              checked={ad.isActive}
              onCheckedChange={(checked) => onToggleStatus(ad, checked)}
              aria-label={`${
                ad.isActive ? 'Deactivate' : 'Activate'
              } advertisement`}
              disabled={isLoading}
              id={`ad-${ad.id}-status`}
            />
            <VisuallyHidden>
              <label htmlFor={`ad-${ad.id}-status`}>
                {ad.isActive ? 'Active' : 'Inactive'}
              </label>
            </VisuallyHidden>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-fit opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
              onClick={() => onNavigateToDetails(ad.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.ad.id === nextProps.ad.id &&
      prevProps.ad.isActive === nextProps.ad.isActive &&
      prevProps.ad.targetUrl === nextProps.ad.targetUrl &&
      prevProps.ad.images.length === nextProps.ad.images.length
    );
  }
);

AdvertisementRow.displayName = 'AdvertisementRow';

// Create a memoized component for mobile view advertisement cards
const MobileAdvertisementCard = memo(
  ({
    ad,
    onToggleStatus,
    onNavigateToDetails,
    isLoading,
    isAdmin,
    getVendorName
  }: {
    ad: AdvertisementWithImages;
    onEdit: (ad: AdvertisementWithImages) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (ad: AdvertisementWithImages, status: boolean) => void;
    onNavigateToDetails: (id: number) => void;
    isLoading: boolean;
    isAdmin: boolean;
    getVendorName: (vendorId: number) => string;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="group border-b p-3 transition-colors hover:bg-muted/50">
        {/* Main card content - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {/* Position and image count */}
            <div className="flex items-center gap-1.5">
              <p className="max-w-[140px] truncate text-sm font-medium capitalize">
                {ad.position.replace(/_/g, ' ').toLowerCase()}
              </p>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  ad.images.length > 0
                    ? 'bg-primary/10 text-primary'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {ad.images.length} {ad.images.length === 1 ? 'img' : 'imgs'}
              </span>
            </div>

            {/* Status indicator */}
            <div className="mt-0.5 flex items-center">
              <div
                className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                  ad.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-[10px] text-muted-foreground">
                {ad.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Vendor (admin only) */}
            {isAdmin && (
              <div className="mt-0.5 flex items-center text-xs text-muted-foreground">
                <Store className="mr-1 h-3 w-3" />
                {getVendorName(ad.vendorId)}
              </div>
            )}
          </div>

          {/* Toggle and actions */}
          <div className="flex items-center">
            <Switch
              className="scale-75"
              checked={ad.isActive}
              onCheckedChange={(checked) => onToggleStatus(ad, checked)}
              aria-label={`Toggle ${ad.id} status`}
              disabled={isLoading}
            />
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 rounded-full p-1 hover:bg-muted"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        {/* Expandable section - only visible when expanded */}
        {expanded && (
          <div className="mt-2 border-t border-dashed border-muted pt-2">
            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 flex-1 text-xs"
                onClick={() => onNavigateToDetails(ad.id)}
              >
                <Pencil className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
  (
    prevProps: {
      ad: AdvertisementWithImages;
      onEdit: (ad: AdvertisementWithImages) => void;
      onDelete: (id: number) => void;
      onToggleStatus: (ad: AdvertisementWithImages, status: boolean) => void;
      onNavigateToDetails: (id: number) => void;
      isLoading: boolean;
      isAdmin: boolean;
      getVendorName: (vendorId: number) => string;
    },
    nextProps: {
      ad: AdvertisementWithImages;
      onEdit: (ad: AdvertisementWithImages) => void;
      onDelete: (id: number) => void;
      onToggleStatus: (ad: AdvertisementWithImages, status: boolean) => void;
      onNavigateToDetails: (id: number) => void;
      isLoading: boolean;
      isAdmin: boolean;
      getVendorName: (vendorId: number) => string;
    }
  ) => {
    return (
      prevProps.ad.id === nextProps.ad.id &&
      prevProps.ad.isActive === nextProps.ad.isActive &&
      prevProps.ad.targetUrl === nextProps.ad.targetUrl &&
      prevProps.ad.images.length === nextProps.ad.images.length
    );
  }
);

MobileAdvertisementCard.displayName = 'MobileAdvertisementCard';

export default function AdvertisementsPage() {
  const { getVendorById } = useVendors();
  const { profile } = useAuth();
  const [currentAd, setCurrentAd] = useState<AdvertisementWithImages | null>(
    null
  );
  const router = useRouter();

  // Get vendor information from profile
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;
  const vendor = getVendorById(vendorId);

  // Determine if user is admin
  const isAdmin = profile?.data?.user.role === 'ADMIN';

  // Use the useAdvertisements hook only once
  const {
    isLoading,
    updateAdvertisement,
    deleteAdvertisement: deleteAd,
    getAdvertisementsByVendorId,
    ads: allAds
  } = useAdvertisements();

  // Helper function to get vendor name from ID
  const getVendorName = useCallback(
    (vendorId: number): string => {
      const vendor = getVendorById(vendorId);
      return vendor ? vendor.name : `Unknown Vendor (ID: ${vendorId})`;
    },
    [getVendorById]
  );

  // Get the appropriate advertisements based on user role
  const advertisements = useMemo(() => {
    if (isAdmin) {
      return allAds || [];
    } else {
      return getAdvertisementsByVendorId(vendorId) || [];
    }
  }, [isAdmin, allAds, getAdvertisementsByVendorId, vendorId]);

  // Group advertisements by vendor for admin view
  const advertisementsByVendor = useMemo(() => {
    if (!isAdmin || !advertisements.length) return [];

    // Group ads by vendorId
    const groupedAds = advertisements.reduce((acc, ad) => {
      if (!acc[ad.vendorId]) {
        acc[ad.vendorId] = {
          vendorId: ad.vendorId,
          vendorName: getVendorName(ad.vendorId),
          advertisements: []
        };
      }
      acc[ad.vendorId]?.advertisements.push(ad);
      return acc;
    }, {} as Record<number, { vendorId: number; vendorName: string; advertisements: AdvertisementWithImages[] }>);

    // Convert to array and sort by vendor name
    return Object.values(groupedAds).sort((a, b) =>
      a.vendorName.localeCompare(b.vendorName)
    );
  }, [isAdmin, advertisements, getVendorName]);

  const editForm = useForm<AdvertisementFormValues>({
    resolver: zodResolver(advertisementFormSchema),
    defaultValues: {
      targetUrl: '',
      position: AdvertisementPosition.FEED,
      altText: '',
      startDate: new Date(),
      endDate: null
    }
  });

  // Reset and populate edit form when current ad changes
  useEffect(() => {
    if (currentAd) {
      editForm.reset({
        targetUrl: currentAd.targetUrl,
        position: currentAd.position,
        altText: currentAd.altText,
        startDate: new Date(currentAd.startDate),
        endDate: currentAd.endDate ? new Date(currentAd.endDate) : null
      });
    }
  }, [currentAd, editForm]);

  const handleEditAdvertisement = (ad: AdvertisementWithImages) => {
    setCurrentAd(ad);
  };

  const deleteAdvertisement = async (adId: number) => {
    if (!vendor && !isAdmin) return;

    if (!confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      await deleteAd.mutateAsync(adId);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const handleStatusToggle = async (
    ad: AdvertisementWithImages,
    newStatus: boolean
  ) => {
    if (!vendor && !isAdmin) return;

    try {
      await updateAdvertisement.mutateAsync({
        id: ad.id,
        data: { isActive: newStatus }
      });
    } catch (error) {
      console.error('Error updating advertisement status:', error);
    }
  };

  const handleNavigateToDetails = (adId: number) => {
    router.push(`/vendors/dashboard/settings/advertisements/${adId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Advertisements
                {isAdmin && (
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    Admin
                  </Badge>
                )}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your advertisements displayed on Snapcaster
              </p>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="md:hidden">
              {isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading advertisements...
                    </p>
                  </div>
                </div>
              ) : advertisements.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">
                    No advertisements found
                  </h3>
                </div>
              ) : (
                <div className="divide-y rounded-lg border">
                  {advertisements.map((ad) => (
                    <MobileAdvertisementCard
                      key={ad.id}
                      ad={ad}
                      onEdit={handleEditAdvertisement}
                      onDelete={deleteAdvertisement}
                      onToggleStatus={handleStatusToggle}
                      onNavigateToDetails={handleNavigateToDetails}
                      isLoading={isLoading}
                      isAdmin={isAdmin}
                      getVendorName={getVendorName}
                    />
                  ))}
                </div>
              )}
            </div>

            <Table className="hidden rounded bg-card md:table">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead className="hidden md:table-cell">
                    Position
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="hidden md:table-cell">
                      Vendor
                    </TableHead>
                  )}
                  <TableHead>Target URL</TableHead>
                  <TableHead className="hidden lg:table-cell">Images</TableHead>
                  <TableHead className="">Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 8 : 7}
                      className="h-24 text-center"
                    >
                      {isLoading ? (
                        <div className="flex justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground">
                              Loading...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No advertisements found
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : isAdmin &&
                  advertisementsByVendor &&
                  advertisementsByVendor.length > 0 ? (
                  // Admin view with vendors grouped
                  advertisementsByVendor.map((vendorGroup) => (
                    <React.Fragment key={vendorGroup.vendorId}>
                      {/* Vendor Header Row */}
                      <TableRow className="bg-primary/20 hover:bg-primary/30">
                        <TableCell
                          colSpan={6}
                          className="py-2 font-medium text-foreground"
                        >
                          <div className="flex items-center">
                            <Store className="mr-2 h-4 w-4" />
                            {vendorGroup.vendorName}
                          </div>
                        </TableCell>
                      </TableRow>
                      {/* Vendor's Advertisements */}
                      {vendorGroup.advertisements.map((ad) => (
                        <AdvertisementRow
                          key={ad.id}
                          ad={ad}
                          onEdit={handleEditAdvertisement}
                          onDelete={deleteAdvertisement}
                          onToggleStatus={handleStatusToggle}
                          onNavigateToDetails={handleNavigateToDetails}
                          isLoading={isLoading}
                          isAdmin={isAdmin}
                          getVendorName={getVendorName}
                        />
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  // Normal vendor view (unchanged)
                  advertisements.map((ad) => (
                    <AdvertisementRow
                      key={ad.id}
                      ad={ad}
                      onEdit={handleEditAdvertisement}
                      onDelete={deleteAdvertisement}
                      onToggleStatus={handleStatusToggle}
                      onNavigateToDetails={handleNavigateToDetails}
                      isLoading={isLoading}
                      isAdmin={isAdmin}
                      getVendorName={getVendorName}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
