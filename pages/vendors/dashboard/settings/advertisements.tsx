import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
  Check,
  X,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import DashboardLayout from '../layout';
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
import { Input } from '@/components/ui/input';
import { useVendors } from '@/hooks/queries/useVendors';
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
  AdvertisementImageType
} from '@/types/advertisements';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAdvertisements } from '@/hooks/queries/useAdvertisements';
import { AD_DIMENSIONS } from '@/components/ads/AdManager';

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

export default function AdvertisementsPage() {
  const { getVendorById } = useVendors();
  const { profile } = useAuth();
  const [advertisements, setAdvertisements] = useState<
    AdvertisementWithImages[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdvertisementWithImages | null>(
    null
  );
  const router = useRouter();

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

  const editForm = useForm<AdvertisementFormValues>({
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
    if (vendor) {
      fetchAdvertisements();
    }
  }, [vendor]);

  // Reset and populate edit form when current ad changes
  useEffect(() => {
    if (currentAd) {
      editForm.reset({
        target_url: currentAd.target_url,
        position: currentAd.position,
        alt_text: currentAd.alt_text,
        start_date: new Date(currentAd.start_date),
        end_date: currentAd.end_date ? new Date(currentAd.end_date) : null
      });
    }
  }, [currentAd, editForm]);

  const fetchAdvertisements = async () => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      const ads = await advertisementService.getAdvertisementsByVendorId(
        vendor.id,
        true
      );
      setAdvertisements(ads);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast.error('Failed to fetch advertisements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: AdvertisementFormValues) => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      await advertisementService.createAdvertisement({
        vendor_id: vendor.id,
        position: values.position,
        target_url: values.target_url,
        alt_text: values.alt_text,
        start_date: values.start_date,
        end_date: values.end_date || null,
        is_active: true
      });

      toast.success('Advertisement created successfully.');

      // Refresh the advertisements list
      fetchAdvertisements();
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast.error('Failed to create advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onEditSubmit = async (values: AdvertisementFormValues) => {
    if (!vendor || !currentAd) return;

    setIsLoading(true);
    try {
      await advertisementService.updateAdvertisement(currentAd.id, {
        position: values.position,
        target_url: values.target_url,
        alt_text: values.alt_text,
        start_date: values.start_date,
        end_date: values.end_date || null
      });

      toast.success('Advertisement updated successfully.');

      // Refresh the advertisements list
      fetchAdvertisements();
      setIsEditDialogOpen(false);
      setCurrentAd(null);
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAdvertisement = (ad: AdvertisementWithImages) => {
    setCurrentAd(ad);
    setIsEditDialogOpen(true);
  };

  const deleteAdvertisement = async (adId: number) => {
    if (!vendor) return;

    if (!confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    setIsLoading(true);
    try {
      await advertisementService.deleteAdvertisement(adId);
      toast.success('Advertisement deleted successfully.');

      // Remove the deleted advertisement from state
      setAdvertisements(advertisements.filter((a) => a.id !== adId));
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (
    ad: AdvertisementWithImages,
    newStatus: boolean
  ) => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      await advertisementService.updateAdvertisement(ad.id, {
        is_active: newStatus
      });

      toast.success(
        `Advertisement ${newStatus ? 'activated' : 'deactivated'} successfully.`
      );

      // Update the advertisement in the state
      setAdvertisements(
        advertisements.map((a) =>
          a.id === ad.id ? { ...a, is_active: newStatus } : a
        )
      );
    } catch (error) {
      console.error('Error updating advertisement status:', error);
      toast.error('Failed to update advertisement status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = (ad: AdvertisementWithImages) => {
    setCurrentAd(ad);
    setIsImageDialogOpen(true);
    imageForm.reset();
  };

  const onImageSubmit = async (values: ImageFormValues) => {
    if (!vendor || !currentAd) return;

    setIsLoading(true);
    try {
      await advertisementService.createAdvertisementImage({
        advertisement_id: currentAd.id,
        image_type: values.image_type,
        image_url: values.image_url,
        is_active: true
      });

      toast.success('Advertisement image added successfully.');

      // Refresh the advertisements list
      fetchAdvertisements();
      setIsImageDialogOpen(false);
      imageForm.reset();
    } catch (error) {
      console.error('Error adding advertisement image:', error);
      toast.error('Failed to add advertisement image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Advertisements
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage advertisements displayed across your storefront
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Advertisement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Advertisement</DialogTitle>
                    <DialogDescription>
                      Add a new advertisement to display on the site.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="target_url">Target URL</Label>
                      <Input
                        id="target_url"
                        placeholder="https://example.com"
                        {...form.register('target_url')}
                      />
                      {form.formState.errors.target_url && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.target_url.message}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        The URL where users will be directed when they click on
                        the ad.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Controller
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(AdvertisementPosition).map(
                                (pos) => (
                                  <SelectItem key={pos} value={pos}>
                                    {pos.replace('_', ' ')}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.position && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.position.message}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Where the advertisement will be displayed on the site.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alt_text">Alt Text</Label>
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Controller
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="start_date"
                                  variant="outline"
                                  className={
                                    !field.value ? 'text-muted-foreground' : ''
                                  }
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                        <Label htmlFor="end_date">End Date (Optional)</Label>
                        <Controller
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="end_date"
                                  variant="outline"
                                  className={
                                    !field.value ? 'text-muted-foreground' : ''
                                  }
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>No end date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Advertisement'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Edit Advertisement Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Advertisement</DialogTitle>
                <DialogDescription>
                  Update the advertisement details.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={editForm.handleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-target_url">Target URL</Label>
                  <Input
                    id="edit-target_url"
                    placeholder="https://example.com"
                    {...editForm.register('target_url')}
                  />
                  {editForm.formState.errors.target_url && (
                    <p className="text-sm font-medium text-destructive">
                      {editForm.formState.errors.target_url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position</Label>
                  <Controller
                    control={editForm.control}
                    name="position"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
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
                  {editForm.formState.errors.position && (
                    <p className="text-sm font-medium text-destructive">
                      {editForm.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-alt_text">Alt Text</Label>
                  <Input
                    id="edit-alt_text"
                    placeholder="Brief description of the advertisement"
                    {...editForm.register('alt_text')}
                  />
                  {editForm.formState.errors.alt_text && (
                    <p className="text-sm font-medium text-destructive">
                      {editForm.formState.errors.alt_text.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-start_date">Start Date</Label>
                    <Controller
                      control={editForm.control}
                      name="start_date"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="edit-start_date"
                              variant="outline"
                              className={
                                !field.value ? 'text-muted-foreground' : ''
                              }
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
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
                    {editForm.formState.errors.start_date && (
                      <p className="text-sm font-medium text-destructive">
                        {editForm.formState.errors.start_date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-end_date">End Date (Optional)</Label>
                    <Controller
                      control={editForm.control}
                      name="end_date"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="edit-end_date"
                              variant="outline"
                              className={
                                !field.value ? 'text-muted-foreground' : ''
                              }
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>No end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) =>
                                date <
                                (editForm.getValues().start_date || new Date())
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {editForm.formState.errors.end_date && (
                      <p className="text-sm font-medium text-destructive">
                        {editForm.formState.errors.end_date.message}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Advertisement'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Add Image Dialog */}
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Advertisement Image</DialogTitle>
                <DialogDescription>
                  Add an image to your advertisement.
                  {currentAd?.position === AdvertisementPosition.TOP_BANNER && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        Recommended dimensions:
                      </p>
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
                  )}
                  {(currentAd?.position === AdvertisementPosition.LEFT_BANNER ||
                    currentAd?.position ===
                      AdvertisementPosition.RIGHT_BANNER) && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">
                        Recommended dimensions:
                      </p>
                      <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                        <li>
                          Side banner: {AD_DIMENSIONS.sideBanner.width}x
                          {AD_DIMENSIONS.sideBanner.height}px
                        </li>
                      </ul>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={imageForm.handleSubmit(onImageSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    {...imageForm.register('image_url')}
                  />
                  {imageForm.formState.errors.image_url && (
                    <p className="text-sm font-medium text-destructive">
                      {imageForm.formState.errors.image_url.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Direct URL to the image file.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_type">Image Type</Label>
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
                          {Object.values(AdvertisementImageType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {imageForm.formState.errors.image_type && (
                    <p className="text-sm font-medium text-destructive">
                      {imageForm.formState.errors.image_type.message}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    MOBILE and DESKTOP are used for responsive display. DEFAULT
                    is used when only one image is needed.
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating a new advertisement.
                  </p>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Advertisement
                  </Button>
                </div>
              ) : (
                <div className="divide-y rounded-lg border">
                  {advertisements.map((ad) => (
                    <div
                      key={ad.id}
                      className="group p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {ad.position.replace('_', ' ')}
                            </div>
                            <div
                              className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold ${
                                ad.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {ad.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <div className="mt-1 text-sm">
                            {ad.images.length > 0 ? (
                              <span className="flex items-center text-muted-foreground">
                                <ImageIcon className="mr-1 h-3 w-3" />
                                {ad.images.length}{' '}
                                {ad.images.length === 1 ? 'image' : 'images'}
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-600">
                                <ImageIcon className="mr-1 h-3 w-3" />
                                No images
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={ad.is_active}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(ad, checked)
                            }
                            aria-label={`Toggle ${ad.id} status`}
                            disabled={isLoading}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-70 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              router.push(
                                `/vendors/dashboard/settings/advertisements/${ad.id}`
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="truncate rounded-md bg-muted/50 p-2">
                          <a
                            href={ad.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <LinkIcon className="mr-1 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{ad.target_url}</span>
                          </a>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(new Date(ad.start_date), 'PP')}
                            {ad.end_date
                              ? ` → ${format(new Date(ad.end_date), 'PP')}`
                              : ' → No end date'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead className="hidden w-[150px] lg:table-cell">
                    Position
                  </TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Start Date
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    End Date
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Images</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
                          <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(true)}
                            className="mt-4"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Advertisement
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  advertisements.map((ad) => (
                    <TableRow key={ad.id} className="group">
                      <TableCell className="hidden font-medium lg:table-cell">
                        <div className="flex items-center gap-2">
                          {ad.position.replace('_', ' ')}
                          {ad.is_active ? (
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                          ) : (
                            <span className="flex h-2 w-2 rounded-full bg-gray-300"></span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        <a
                          href={ad.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          <LinkIcon className="mr-1 h-3 w-3" />
                          <span className="truncate">{ad.target_url}</span>
                        </a>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {format(new Date(ad.start_date), 'PP')}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {ad.end_date
                          ? format(new Date(ad.end_date), 'PP')
                          : 'No end date'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span
                            className={`mr-2 rounded-full px-2 py-1 text-xs ${
                              ad.images.length > 0
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ad.images.length}{' '}
                            {ad.images.length === 1 ? 'image' : 'images'}
                          </span>
                          {ad.images.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              (
                              {ad.images
                                .map((img) => img.image_type)
                                .join(', ')}
                              )
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={ad.is_active}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(ad, checked)
                            }
                            aria-label={`Toggle ${ad.id} status`}
                            disabled={isLoading}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {ad.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
                            onClick={() =>
                              router.push(
                                `/vendors/dashboard/settings/advertisements/${ad.id}`
                              )
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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
