import {
  Calendar as CalendarIcon,
  ArrowLeft,
  Trash2,
  Pencil,
  Plus,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import DashboardLayout from '../../layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  AdvertisementImageType
} from '@/types/advertisements';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { AD_DIMENSIONS } from '@/components/ads/AdManager';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// Form schema for advertisement validation
const advertisementFormSchema = z.object({
  target_url: z.string().url({
    message: 'Please enter a valid URL.'
  }),
  position: z.nativeEnum(AdvertisementPosition),
  alt_text: z.string().min(3, {
    message: 'Alt text must be at least 3 characters.'
  }),
  start_date: z.date(),
  end_date: z.date().nullable().optional()
});

type AdvertisementFormValues = z.infer<typeof advertisementFormSchema>;

const imageFormSchema = z.object({
  image_url: z.string().url({
    message: 'Please enter a valid image URL.'
  }),
  image_type: z.nativeEnum(AdvertisementImageType)
});

type ImageFormValues = z.infer<typeof imageFormSchema>;

export default function EditAdvertisementPage() {
  const router = useRouter();
  const { id } = router.query;
  const advertisementId = id ? parseInt(id as string) : undefined;

  const [advertisement, setAdvertisement] =
    useState<AdvertisementWithImages | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const { profile } = useAuth();
  const { getVendorById } = useVendors();
  const {
    isLoading: isQueryLoading,
    getAdvertisementById,
    fetchAdvertisementById,
    updateAdvertisement,
    deleteAdvertisement,
    addAdvertisementImage,
    deleteAdvertisementImage
  } = useAdvertisements();

  // Track loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const vendor = getVendorById(profile?.data?.user.vendorData?.vendorId || 0);

  const form = useForm<AdvertisementFormValues>({
    resolver: zodResolver(advertisementFormSchema),
    defaultValues: {
      target_url: '',
      position: AdvertisementPosition.FEED,
      alt_text: '',
      start_date: new Date(),
      end_date: null
    }
  });

  const imageForm = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      image_url: '',
      image_type: AdvertisementImageType.DEFAULT
    }
  });

  // Track combined loading state for better UX
  const isMutating =
    updateAdvertisement.isPending ||
    deleteAdvertisement.isPending ||
    addAdvertisementImage.isPending ||
    deleteAdvertisementImage.isPending;

  // Show loading state when initial data is loading or any mutation is in progress
  const isPageLoading = isLoading || isQueryLoading || isMutating;

  // Show appropriate loading state based on mutation status
  const statusLabelText = updateAdvertisement.isPending
    ? 'Updating status...'
    : advertisement?.is_active
    ? 'Active'
    : 'Inactive';

  // Fetch advertisement on component mount
  useEffect(() => {
    async function loadAdvertisement() {
      if (!advertisementId || !vendor) {
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
          const ad = await fetchAdvertisementById(vendor.id, advertisementId);

          if (!ad) {
            router.push('/vendors/dashboard/settings/advertisements');
            return;
          }

          setAdvertisement(ad);
        }
      } catch (error) {
        console.error('Error loading advertisement:', error);
        toast.error('Failed to load advertisement');
      } finally {
        setIsLoading(false);
      }
    }

    loadAdvertisement();
  }, [
    advertisementId,
    vendor,
    router,
    fetchAdvertisementById,
    getAdvertisementById
  ]);

  // Reset and populate form when advertisement data changes
  useEffect(() => {
    if (advertisement) {
      form.reset({
        target_url: advertisement.target_url,
        position: advertisement.position,
        alt_text: advertisement.alt_text,
        start_date: new Date(advertisement.start_date),
        end_date: advertisement.end_date
          ? new Date(advertisement.end_date)
          : null
      });
    }
  }, [advertisement, form]);

  const onSubmit = async (values: AdvertisementFormValues) => {
    if (!vendor || !advertisement) return;

    try {
      await updateAdvertisement.mutateAsync({
        id: advertisement.id,
        data: {
          position: values.position,
          target_url: values.target_url,
          alt_text: values.alt_text,
          start_date: values.start_date,
          end_date: values.end_date || null
        }
      });

      // Update our local state with the updated advertisement
      const updatedAd = getAdvertisementById(advertisement.id);
      if (updatedAd) {
        setAdvertisement(updatedAd);
      }
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };

  const handleDeleteAdvertisement = async () => {
    if (!vendor || !advertisement) return;

    try {
      await deleteAdvertisement.mutateAsync(advertisement.id);
      router.push('/vendors/dashboard/settings/advertisements');
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!vendor || !advertisement) return;

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

  const onImageSubmit = async (values: ImageFormValues) => {
    if (!vendor || !advertisement) return;

    try {
      await addAdvertisementImage.mutateAsync({
        advertisement_id: advertisement.id,
        image_type: values.image_type,
        image_url: values.image_url,
        is_active: true
      });

      // Update our local state with the updated advertisement
      const updatedAd = getAdvertisementById(advertisement.id);
      if (updatedAd) {
        setAdvertisement(updatedAd);
      } else {
        // Fallback to fetching if needed
        const ad = await fetchAdvertisementById(vendor.id, advertisement.id);
        if (ad) {
          setAdvertisement(ad);
        }
      }

      setIsImageDialogOpen(false);
      imageForm.reset();
    } catch (error) {
      console.error('Error adding advertisement image:', error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!vendor || !advertisement) return;

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

  // Show loading indicator when fetching data
  if ((isLoading || isQueryLoading) && !advertisement) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push('/vendors/dashboard/settings/advertisements')
                }
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
              <h3 className="mt-6 text-lg font-medium">
                Loading advertisement...
              </h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Please wait while we fetch your advertisement details.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!advertisement) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen flex-col">
          <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push('/vendors/dashboard/settings/advertisements')
                }
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
              <h3 className="mt-6 text-lg font-medium">
                Advertisement not found
              </h3>
              <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                We couldn't find the advertisement you're looking for. It may
                have been deleted or you may not have permission to view it.
              </p>
              <Button
                className="mt-6"
                onClick={() =>
                  router.push('/vendors/dashboard/settings/advertisements')
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Advertisements
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getImageDimensionInfo = (position: AdvertisementPosition) => {
    if (position === AdvertisementPosition.TOP_BANNER) {
      return (
        <div className="mt-1.5">
          <p className="text-xs font-medium md:text-sm">Recommended:</p>
          <ul className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
            <li>
              Desktop: {AD_DIMENSIONS.topBanner.desktop.width}x
              {AD_DIMENSIONS.topBanner.desktop.height}px
            </li>
            <li>
              Mobile: {AD_DIMENSIONS.topBanner.mobile.width}x
              {AD_DIMENSIONS.topBanner.mobile.height}px
            </li>
          </ul>
        </div>
      );
    } else if (
      position === AdvertisementPosition.LEFT_BANNER ||
      position === AdvertisementPosition.RIGHT_BANNER
    ) {
      return (
        <div className="mt-1.5">
          <p className="text-xs font-medium md:text-sm">Recommended:</p>
          <ul className="mt-0.5 text-[10px] text-muted-foreground md:text-xs">
            <li>
              Side banner: {AD_DIMENSIONS.sideBanner.width}x
              {AD_DIMENSIONS.sideBanner.height}px
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

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
                onClick={() =>
                  router.push('/vendors/dashboard/settings/advertisements')
                }
                className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="text-xs">Back</span>
              </Button>

              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      advertisement.is_active ? 'bg-green-500' : 'bg-gray-300'
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

          {/* Simplified two-column layout */}
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
            {/* Advertisement Details Card - Simplified */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-sm">
                <CardHeader className="border-b bg-muted/20 p-4 md:px-5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        advertisement.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <CardTitle className="text-sm font-medium md:text-base">
                      Details
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-5">
                  <form
                    id="edit-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="target_url"
                        className="text-xs font-medium md:text-sm"
                      >
                        Target URL
                      </Label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Input
                          id="target_url"
                          placeholder="https://example.com"
                          className="h-8 pl-8 text-xs md:h-9 md:text-sm"
                          {...form.register('target_url')}
                        />
                      </div>
                      {form.formState.errors.target_url && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.target_url.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="position"
                        className="text-xs font-medium md:text-sm"
                      >
                        Position
                      </Label>
                      <Controller
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled
                          >
                            <SelectTrigger className="h-8 text-xs md:h-9 md:text-sm">
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(AdvertisementPosition).map(
                                (pos) => (
                                  <SelectItem
                                    key={pos}
                                    value={pos}
                                    className="text-xs md:text-sm"
                                  >
                                    {pos.replace('_', ' ')}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.position && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.position.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="alt_text"
                        className="text-xs font-medium md:text-sm"
                      >
                        Alt Text
                      </Label>
                      <Input
                        id="alt_text"
                        placeholder="Brief description of the advertisement"
                        className="h-8 text-xs md:h-9 md:text-sm"
                        {...form.register('alt_text')}
                      />
                      {form.formState.errors.alt_text && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.alt_text.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs font-medium md:text-sm">
                          Schedule
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="start_date"
                            className="text-xs md:text-sm"
                          >
                            Start Date
                          </Label>
                          <Controller
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="start_date"
                                    variant="outline"
                                    className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                                      !field.value
                                        ? 'text-muted-foreground'
                                        : ''
                                    }`}
                                  >
                                    <CalendarIcon className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                    {field.value ? (
                                      format(field.value, 'PP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="end_date"
                            className="text-xs md:text-sm"
                          >
                            End Date{' '}
                            <span className="font-normal text-muted-foreground">
                              (Optional)
                            </span>
                          </Label>
                          <Controller
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="end_date"
                                    variant="outline"
                                    className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                                      !field.value
                                        ? 'text-muted-foreground'
                                        : ''
                                    }`}
                                  >
                                    <CalendarIcon className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                                    {field.value ? (
                                      format(field.value, 'PP')
                                    ) : (
                                      <span>No end date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value || undefined}
                                    onSelect={field.onChange}
                                    initialFocus
                                    disabled={(date) =>
                                      date <
                                      (form.getValues().start_date ||
                                        new Date())
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        form="edit-form"
                        disabled={
                          updateAdvertisement.isPending ||
                          form.formState.isSubmitting
                        }
                        className="h-8 w-full text-xs sm:w-auto md:h-9 md:text-sm"
                      >
                        <Save className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                        {updateAdvertisement.isPending
                          ? 'Saving...'
                          : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Images Card - Simplified */}
            <div className="lg:col-span-1">
              <Card className="flex h-full flex-col overflow-hidden border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-2 border-b bg-muted/20 p-4 md:px-5">
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium md:text-base">
                      Images
                    </CardTitle>
                  </div>

                  <Dialog
                    open={isImageDialogOpen}
                    onOpenChange={setIsImageDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-xs md:h-8"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] p-4 sm:max-w-[400px] md:p-5">
                      <DialogHeader className="space-y-1">
                        <DialogTitle className="text-base">
                          Add Image
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                          {getImageDimensionInfo(advertisement.position)}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={imageForm.handleSubmit(onImageSubmit)}
                        className="space-y-3 pt-2"
                      >
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="image_url"
                            className="text-xs font-medium"
                          >
                            Image URL
                          </Label>
                          <Input
                            id="image_url"
                            placeholder="https://example.com/image.jpg"
                            className="h-8 text-xs md:h-9 md:text-sm"
                            {...imageForm.register('image_url')}
                          />
                          {imageForm.formState.errors.image_url && (
                            <p className="text-xs font-medium text-destructive">
                              {imageForm.formState.errors.image_url.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="image_type"
                            className="text-xs font-medium"
                          >
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
                                <SelectTrigger className="h-8 text-xs md:h-9 md:text-sm">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.values(AdvertisementImageType).map(
                                    (type) => (
                                      <SelectItem
                                        key={type}
                                        value={type}
                                        className="text-xs md:text-sm"
                                      >
                                        {type}
                                      </SelectItem>
                                    )
                                  )}
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
                            MOBILE for small screens, DESKTOP for larger
                            screens, DEFAULT for all sizes.
                          </p>
                        </div>

                        <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 flex-1 text-xs sm:flex-none md:text-sm"
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            disabled={addAdvertisementImage.isPending}
                            className="h-8 flex-1 text-xs sm:flex-none md:text-sm"
                          >
                            {addAdvertisementImage.isPending
                              ? 'Adding...'
                              : 'Add Image'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent className="flex-grow overflow-auto p-4 md:px-5">
                  {advertisement.images.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center py-10">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/70">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <h3 className="mt-3 text-sm font-medium">
                        No images yet
                      </h3>
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
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {advertisement.images.length}{' '}
                          {advertisement.images.length === 1
                            ? 'image'
                            : 'images'}
                          <span className="ml-1">
                            for{' '}
                            <span className="font-medium">
                              {advertisement.position
                                .replace('_', ' ')
                                .toLowerCase()}
                            </span>
                          </span>
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => setIsImageDialogOpen(true)}
                        >
                          <Plus className="mr-1 h-2.5 w-2.5" />
                          Add
                        </Button>
                      </div>

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
                                <p className="max-w-full truncate pr-1 text-[10px] text-muted-foreground">
                                  {image.image_url}
                                </p>
                                <button
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      image.image_url
                                    )
                                  }
                                  className="text-[10px] text-muted-foreground hover:text-primary"
                                >
                                  Copy URL
                                </button>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
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
            </div>
          </div>

          {/* Delete button at bottom - More minimal */}
          <div className="pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-full border-red-100 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 md:max-w-[200px] md:text-sm"
                >
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Delete Advertisement
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] p-4 sm:max-w-[400px]">
                <AlertDialogHeader className="space-y-1">
                  <AlertDialogTitle className="text-base">
                    Delete advertisement?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs">
                    This cannot be undone. This will permanently delete the
                    advertisement and all images.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:justify-end">
                  <AlertDialogCancel className="h-8 flex-1 text-xs sm:flex-none md:text-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAdvertisement}
                    className="h-8 flex-1 bg-red-600 text-xs hover:bg-red-700 sm:flex-none md:text-sm"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
