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
  advertisementService,
  CreateAdvertisementRequest,
  CreateAdvertisementImageRequest
} from '@/services/advertisementService';
import {
  AdvertisementWithImages,
  AdvertisementPosition,
  AdvertisementImageType,
  AdvertisementImage
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
  const advertisementId = parseInt(id as string);

  const [advertisement, setAdvertisement] =
    useState<AdvertisementWithImages | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { getVendorById } = useVendors();

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

  useEffect(() => {
    if (advertisementId && !isNaN(advertisementId)) {
      fetchAdvertisement();
    }
  }, [advertisementId]);

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

  const fetchAdvertisement = async () => {
    if (!advertisementId || isNaN(advertisementId)) return;

    setIsLoading(true);
    try {
      // Fetch all advertisements for the vendor and find the one we need
      const ads = await advertisementService.getAdvertisementsByVendorId(
        vendor?.id || 0,
        true
      );

      const ad = ads.find((a) => a.id === advertisementId);
      if (ad) {
        setAdvertisement(ad);
      } else {
        toast.error('Advertisement not found');
        router.push('/vendors/dashboard/settings/advertisements');
      }
    } catch (error) {
      console.error('Error fetching advertisement:', error);
      toast.error('Failed to fetch advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: AdvertisementFormValues) => {
    if (!vendor || !advertisement) return;

    setIsSaving(true);
    try {
      await advertisementService.updateAdvertisement(advertisement.id, {
        position: values.position,
        target_url: values.target_url,
        alt_text: values.alt_text,
        start_date: values.start_date,
        end_date: values.end_date || null
      });

      toast.success('Advertisement updated successfully.');
      fetchAdvertisement();
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAdvertisement = async () => {
    if (!vendor || !advertisement) return;

    setIsLoading(true);
    try {
      await advertisementService.deleteAdvertisement(advertisement.id);
      toast.success('Advertisement deleted successfully.');
      router.push('/vendors/dashboard/settings/advertisements');
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (newStatus: boolean) => {
    if (!vendor || !advertisement) return;

    setIsLoading(true);
    try {
      await advertisementService.updateAdvertisement(advertisement.id, {
        is_active: newStatus
      });

      toast.success(
        `Advertisement ${newStatus ? 'activated' : 'deactivated'} successfully.`
      );

      // Update the advertisement in state
      setAdvertisement({
        ...advertisement,
        is_active: newStatus
      });
    } catch (error) {
      console.error('Error updating advertisement status:', error);
      toast.error('Failed to update advertisement status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onImageSubmit = async (values: ImageFormValues) => {
    if (!vendor || !advertisement) return;

    setIsLoading(true);
    try {
      await advertisementService.createAdvertisementImage({
        advertisement_id: advertisement.id,
        image_type: values.image_type,
        image_url: values.image_url,
        is_active: true
      });

      toast.success('Advertisement image added successfully.');
      fetchAdvertisement();
      setIsImageDialogOpen(false);
      imageForm.reset();
    } catch (error) {
      console.error('Error adding advertisement image:', error);
      toast.error('Failed to add advertisement image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!vendor || !advertisement) return;

    setIsLoading(true);
    try {
      await advertisementService.deleteAdvertisementImage(imageId);

      toast.success('Image deleted successfully.');

      // Update the advertisement in state by removing the deleted image
      setAdvertisement({
        ...advertisement,
        images: advertisement.images.filter((img) => img.id !== imageId)
      });
    } catch (error) {
      console.error('Error deleting advertisement image:', error);
      toast.error('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !advertisement) {
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
        <div className="mt-2">
          <p className="text-sm font-medium">Recommended dimensions:</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
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
        <div className="mt-2">
          <p className="text-sm font-medium">Recommended dimensions:</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
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
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
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
                  <span className="hidden sm:inline">
                    Back to Advertisements
                  </span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-4 sm:mt-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full ${
                      advertisement.is_active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                  <span className="text-sm font-medium">
                    {advertisement.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <Switch
                  checked={advertisement.is_active}
                  onCheckedChange={handleStatusToggle}
                  aria-label="Toggle advertisement status"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Edit Advertisement
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit advertisement details and manage advertisement images
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Advertisement Details Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="gap-1.5 pb-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      advertisement.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        advertisement.is_active ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                  <CardTitle>Advertisement Details</CardTitle>
                </div>
                <CardDescription>
                  Edit the information about your advertisement
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <form
                  id="edit-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-3">
                    <Label htmlFor="target_url" className="text-sm font-medium">
                      Target URL
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="target_url"
                        placeholder="https://example.com"
                        className="pl-10"
                        {...form.register('target_url')}
                      />
                    </div>
                    {form.formState.errors.target_url && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.target_url.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      The URL where users will be directed when they click on
                      your ad.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="position" className="text-sm font-medium">
                      Advertisement Position
                    </Label>
                    <Controller
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(AdvertisementPosition).map((pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.position && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.position.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      The location where your advertisement will be displayed on
                      the site.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="alt_text" className="text-sm font-medium">
                      Alt Text
                    </Label>
                    <Input
                      id="alt_text"
                      placeholder="Brief description of the advertisement"
                      {...form.register('alt_text')}
                    />
                    {form.formState.errors.alt_text && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.alt_text.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      A text description for screen readers and SEO.
                    </p>
                  </div>

                  <div className="space-y-4 rounded-lg border border-dashed bg-muted/30 p-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Schedule</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="start_date" className="text-sm">
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
                                  className={`w-full justify-start text-left ${
                                    !field.value ? 'text-muted-foreground' : ''
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, 'PPP')
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
                        {form.formState.errors.start_date && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.start_date.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_date" className="text-sm">
                          End Date (Optional)
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
                                  className={`w-full justify-start text-left ${
                                    !field.value ? 'text-muted-foreground' : ''
                                  }`}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, 'PPP')
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
                                    (form.getValues().start_date || new Date())
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        {form.formState.errors.end_date && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.end_date.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col justify-between gap-2 pt-6 sm:flex-row">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Advertisement
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the advertisement and all its images.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAdvertisement}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="submit"
                  form="edit-form"
                  disabled={isSaving}
                  className="w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>

            {/* Images Card */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Advertisement Images</CardTitle>
                  </div>
                  <CardDescription>
                    Manage images for this advertisement
                  </CardDescription>
                </div>

                <Dialog
                  open={isImageDialogOpen}
                  onOpenChange={setIsImageDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1 shadow-sm">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Image</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Advertisement Image</DialogTitle>
                      <DialogDescription>
                        Add an image to your advertisement.
                        {getImageDimensionInfo(advertisement.position)}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={imageForm.handleSubmit(onImageSubmit)}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="image_url"
                          className="text-sm font-medium"
                        >
                          Image URL
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="image_url"
                            placeholder="https://example.com/image.jpg"
                            className="pl-10"
                            {...imageForm.register('image_url')}
                          />
                        </div>
                        {imageForm.formState.errors.image_url && (
                          <p className="text-sm font-medium text-destructive">
                            {imageForm.formState.errors.image_url.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Direct URL to the image file.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="image_type"
                          className="text-sm font-medium"
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
                              <SelectTrigger>
                                <SelectValue placeholder="Select image type" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(AdvertisementImageType).map(
                                  (type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {imageForm.formState.errors.image_type && (
                          <p className="text-sm font-medium text-destructive">
                            {imageForm.formState.errors.image_type.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          MOBILE and DESKTOP are used for responsive display.
                          DEFAULT is used when only one image is needed.
                        </p>
                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Adding...' : 'Add Image'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {advertisement.images.length === 0 ? (
                  <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No images added yet
                    </h3>
                    <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                      Add images to your advertisement to make it more engaging
                      for users.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => setIsImageDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                          <ImageIcon className="h-3.5 w-3.5 text-blue-700" />
                        </div>
                        <h3 className="text-sm font-medium">
                          Image Requirements
                        </h3>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          For this advertisement position{' '}
                          <span className="font-medium">
                            {advertisement.position.replace('_', ' ')}
                          </span>
                          , you need the following image types:
                        </p>
                        {getImageDimensionInfo(advertisement.position)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                          Current Images ({advertisement.images.length})
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsImageDialogOpen(true)}
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          Add More
                        </Button>
                      </div>
                      <div className="divide-y">
                        {advertisement.images.map((image) => (
                          <div
                            key={image.id}
                            className="group flex items-start justify-between gap-4 py-4 first:pt-0"
                          >
                            <div className="flex space-x-4">
                              <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
                                <img
                                  src={image.image_url}
                                  alt={`${advertisement.alt_text} - ${image.image_type}`}
                                  className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    {image.image_type}
                                  </span>
                                </div>
                                <p className="max-w-[200px] truncate text-sm text-muted-foreground sm:max-w-[300px]">
                                  {image.image_url}
                                </p>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        image.image_url
                                      )
                                    }
                                    className="inline-flex items-center hover:text-primary"
                                  >
                                    Copy URL
                                  </button>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteImage(image.id)}
                              className="text-red-500 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
