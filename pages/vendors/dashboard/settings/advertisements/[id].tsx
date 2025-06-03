import { useRouter } from 'next/router';

import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import DashboardLayout from '../../layout';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { AdvertisementFormValues } from '@/components/vendors/advertisements';
import {
  AdvertisementDetailsForm,
  AdvertisementImageGallery,
  AdvertisementLoadingState,
  AdvertisementNotFound
} from '@/components/vendors/advertisements';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import type { AdvertisementWithImages } from '@/types/advertisements';

export default function EditAdvertisementPage() {
  const router = useRouter();
  const { id } = router.query;
  const advertisementId = id ? parseInt(id as string) : undefined;

  const [advertisement, setAdvertisement] =
    useState<AdvertisementWithImages | null>(null);

  const { profile } = useAuth();
  const { getVendorById } = useVendors();
  const {
    isLoading: isQueryLoading,
    getAdvertisementById,
    fetchAdvertisementById,
    updateAdvertisement,
    deleteAdvertisementImage
  } = useAdvertisements();

  // Track loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const vendor = getVendorById(profile?.data?.user.vendorData?.vendorId || 0);

  // Show appropriate loading state based on mutation status
  const statusLabelText = updateAdvertisement.isPending
    ? 'Updating status...'
    : advertisement?.is_active
    ? 'Active'
    : 'Inactive';

  // Determine if user is admin
  const isAdmin = profile?.data?.user.role === 'ADMIN';

  // Fetch advertisement on component mount
  useEffect(() => {
    async function loadAdvertisement() {
      if (!advertisementId) {
        return;
      }

      // Admin users should be able to load ads even without a vendor
      if (!isAdmin && !vendor) {
        return;
      }

      setIsLoading(true);
      try {
        // First, check if we have the advertisement in cache
        const cachedAd = getAdvertisementById(advertisementId);

        if (cachedAd) {
          // If found in cache, use it directly
          setAdvertisement(cachedAd);
        } else {
          // If not in cache, fetch it (which will also update the cache)
          // For admin users, we can pass any vendorId since they have access to all ads
          const ad = await fetchAdvertisementById(advertisementId);

          if (!ad) {
            router.push('/vendors/dashboard/settings/advertisements');
            return;
          }

          setAdvertisement(ad);
        }
      } catch (error) {
        console.error('Error loading advertisement:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdvertisement();
  }, [
    advertisementId,
    vendor,
    isAdmin,
    router,
    fetchAdvertisementById,
    getAdvertisementById
  ]);

  const onFormSubmit = async (values: AdvertisementFormValues) => {
    if ((!isAdmin && !vendor) || !advertisement) return;

    try {
      // Compare current form values with the advertisement data
      // and only include changed fields in the update
      const changedFields: Partial<AdvertisementFormValues> = {};

      // Check each field to see if it has changed
      if (values.target_url !== advertisement.target_url) {
        changedFields.target_url = values.target_url;
      }

      if (values.position !== advertisement.position) {
        changedFields.position = values.position;
      }

      if (values.alt_text !== advertisement.alt_text) {
        changedFields.alt_text = values.alt_text;
      }

      // For date fields, we need to compare the date strings since the Date objects will be different
      const formStartDate = values.start_date
        ? format(values.start_date, 'yyyy-MM-dd')
        : null;
      const adStartDate = advertisement.start_date
        ? format(new Date(advertisement.start_date), 'yyyy-MM-dd')
        : null;

      if (formStartDate !== adStartDate) {
        changedFields.start_date = values.start_date;
      }

      const formEndDate = values.end_date
        ? format(values.end_date, 'yyyy-MM-dd')
        : null;
      const adEndDate = advertisement.end_date
        ? format(new Date(advertisement.end_date), 'yyyy-MM-dd')
        : null;

      if (formEndDate !== adEndDate) {
        changedFields.end_date = values.end_date || null;
      }

      // Only send the update request if there are changes
      if (Object.keys(changedFields).length > 0) {
        setIsSaving(true);

        // Convert the changedFields to the expected format for updateAdvertisement
        const updateData: Record<string, any> = {
          ...changedFields
        };

        // Only include dates if they're defined
        if (changedFields.start_date !== undefined) {
          updateData.start_date = changedFields.start_date;
        }

        if (changedFields.end_date !== undefined) {
          updateData.end_date = changedFields.end_date;
        }

        await updateAdvertisement.mutateAsync({
          id: advertisement.id,
          data: updateData
        });

        // Update our local state with the updated advertisement
        const updatedAd = getAdvertisementById(advertisement.id);
        if (updatedAd) {
          setAdvertisement(updatedAd);
        }
      }
    } catch (error) {
      console.error('Error updating advertisement:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusToggle = async (newStatus: boolean) => {
    if ((!isAdmin && !vendor) || !advertisement) return;

    try {
      await updateAdvertisement.mutateAsync({
        id: advertisement.id,
        data: { is_active: newStatus }
      });

      // Update the advertisement in state
      setAdvertisement({
        ...advertisement,
        is_active: newStatus
      });
    } catch (error) {
      console.error('Error updating advertisement status:', error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if ((!isAdmin && !vendor) || !advertisement) return;

    try {
      await deleteAdvertisementImage.mutateAsync(imageId);

      // Update the advertisement in state by removing the deleted image
      setAdvertisement({
        ...advertisement,
        images: advertisement.images.filter((img) => img.id !== imageId)
      });
    } catch (error) {
      console.error('Error deleting advertisement image:', error);
    }
  };

  const handleBackClick = () =>
    router.push('/vendors/dashboard/settings/advertisements');

  // Show loading indicator when fetching data
  if ((isLoading || isQueryLoading) && !advertisement) {
    return (
      <DashboardLayout>
        <AdvertisementLoadingState onBack={handleBackClick} />
      </DashboardLayout>
    );
  }

  if (!advertisement) {
    return (
      <DashboardLayout>
        <AdvertisementNotFound onBack={handleBackClick} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col ">
        <div className="flex-1 space-y-4 p-4 pt-6 md:space-y-5 md:p-6">
          {/* Header Section - Simplified and minimal */}
          <div className="flex flex-col space-y-4 md:space-y-5">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="text-xs">Back</span>
              </Button>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      advertisement.is_active ? 'bg-primary' : 'bg-muted'
                    }`}
                  ></span>
                  <span className="text-xs text-muted-foreground">
                    {statusLabelText}
                  </span>
                </div>
                <Switch
                  checked={advertisement.is_active}
                  onCheckedChange={handleStatusToggle}
                  aria-label="Toggle advertisement status"
                  disabled={updateAdvertisement.isPending}
                  className="scale-80"
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-medium tracking-tight md:text-2xl">
                Edit Advertisement
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Update details and manage images
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <AdvertisementDetailsForm
                advertisement={advertisement}
                isActive={advertisement.is_active}
                onSubmit={onFormSubmit}
                isPending={updateAdvertisement.isPending || isSaving}
              />
            </div>

            <div className="xl:col-span-2">
              <AdvertisementImageGallery
                advertisement={advertisement}
                onDeleteImage={handleDeleteImage}
                isLoading={deleteAdvertisementImage.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
