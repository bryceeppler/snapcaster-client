import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  Clock,
  Percent,
  Store,
  Tag,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import DashboardLayout from '../../../layout';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import type {
  Discount,
  DiscountFormValues,
  UpdateDiscountPayload
} from '@/types/discounts';
import { DiscountType } from '@/types/discounts';

// Form schema for discount validation
const discountFormSchema = z.object({
  code: z.string().min(3, {
    message: 'Discount code must be at least 3 characters.'
  }),
  percentage: z.coerce
    .number()
    .min(1, { message: 'Percentage must be at least 1%.' })
    .max(100, { message: 'Percentage cannot exceed 100%.' }),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  isActive: z.boolean().default(true)
});

export default function EditDiscountPage() {
  const router = useRouter();
  const { id } = router.query;
  const discountId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  const { profile } = useAuth();
  const { getVendorById, vendors } = useVendors();
  const { updateDiscount, discounts, isLoading } = useDiscounts();

  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(true);

  // Get admin status
  const isAdmin = profile?.data?.user.role === 'ADMIN';

  // Get the vendor ID from the user profile
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;

  // Get the vendor information (only needed for non-admin users)
  const vendor = getVendorById(vendorId);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: '',
      percentage: 5,
      startDate: new Date(),
      endDate: null,
      isActive: true
    }
  });

  // Find discount by ID from the discounts array
  const getDiscountById = (id: number): Discount | undefined => {
    return discounts.find((discount) => discount.id === id);
  };

  // Load discount data
  useEffect(() => {
    const loadDiscount = () => {
      if (!discountId) return;

      try {
        setIsLoadingDiscount(true);
        const discount = getDiscountById(discountId);

        if (!discount) {
          toast.error('Discount not found');
          router.push('/vendors/dashboard/settings/discounts');
          return;
        }

        // Check if the user has permission to edit this discount
        if (!isAdmin && discount.vendorId !== vendor?.id) {
          toast.error('You do not have permission to edit this discount');
          router.push('/vendors/dashboard/settings/discounts');
          return;
        }

        setCurrentDiscount(discount);

        // Populate form with discount data
        form.reset({
          code: discount.code,
          percentage: discount.discountAmount,
          startDate: new Date(discount.startsAt),
          endDate: discount.expiresAt ? new Date(discount.expiresAt) : null,
          isActive: discount.isActive
        });
      } catch (error) {
        console.error('Error loading discount:', error);
        toast.error('Failed to load discount');
      } finally {
        setIsLoadingDiscount(false);
      }
    };

    // Only load discount if we have discounts data from the useDiscounts hook
    if (discountId && !isLoading && discounts.length > 0) {
      loadDiscount();
    }
  }, [discountId, discounts, isLoading, form, isAdmin, router, vendor?.id]);

  const onSubmit = async (values: DiscountFormValues) => {
    if (!currentDiscount) {
      toast.error('Missing discount information');
      return;
    }

    // Non-admin users need vendor validation
    if (!isAdmin && !vendor) {
      toast.error('Missing vendor information');
      return;
    }

    try {
      const payload: UpdateDiscountPayload = {
        id: currentDiscount.id,
        data: {
          code: values.code,
          discountAmount: values.percentage,
          discountType: DiscountType.PERCENTAGE, // Currently only supporting percentage discounts
          startsAt: values.startDate,
          expiresAt: values.endDate || null,
          isActive: values.isActive
        }
      };

      await updateDiscount.mutateAsync(payload);

      toast.success('Discount updated successfully');
      router.push('/vendors/dashboard/settings/discounts');
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:space-y-5 md:p-6">
          {/* Header Section - Simplified and minimal */}
          <div className="flex flex-col space-y-4 md:space-y-5">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push('/vendors/dashboard/settings/discounts')
                }
                className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                <span className="text-xs">Back</span>
              </Button>
            </div>

            <div>
              <h1 className="text-xl font-medium tracking-tight md:text-2xl">
                Edit Discount Code
                {isAdmin && (
                  <span className="ml-2 text-sm text-primary">(Admin)</span>
                )}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Update details for your existing discount code
              </p>
            </div>
          </div>

          {/* Simplified layout */}
          <div className="mx-auto w-full max-w-2xl">
            {isLoadingDiscount ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-64 w-full rounded-md" />
                <Skeleton className="h-64 w-full rounded-md" />
              </div>
            ) : !currentDiscount ? (
              <div className="rounded-md bg-red-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-3 text-sm font-medium text-red-800">
                  Discount not found
                </h3>
                <p className="mt-2 text-xs text-red-700">
                  The discount code may have been deleted or you don't have
                  permission to view it.
                </p>
                <Button
                  className="mt-4 h-8 text-xs"
                  onClick={() =>
                    router.push('/vendors/dashboard/settings/discounts')
                  }
                >
                  <ArrowLeft className="mr-1.5 h-3 w-3" />
                  Back to Discounts
                </Button>
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Basic Details Card */}
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="border-b bg-muted/20 p-4 md:px-5">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      <CardTitle className="text-sm font-medium md:text-base">
                        Basic Details
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-5">
                    <div className="space-y-4">
                      {/* Vendor information (admin only) */}
                      {isAdmin && currentDiscount && (
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="vendor"
                            className="text-xs font-medium md:text-sm"
                          >
                            Vendor
                          </Label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                              <Store className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="flex h-8 w-full items-center rounded-md border bg-muted/10 pl-8 text-xs md:h-9 md:text-sm">
                              {vendors.find(
                                (v) => v.id === currentDiscount.vendor_id
                              )?.name ||
                                `Vendor ID: ${currentDiscount.vendor_id}`}
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground md:text-xs">
                            This discount code belongs to this vendor
                          </p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="code"
                          className="text-xs font-medium md:text-sm"
                        >
                          Discount Code
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <Input
                            id="code"
                            placeholder="e.g., SUMMER2023"
                            className="h-8 pl-8 text-xs uppercase md:h-9 md:text-sm"
                            {...form.register('code')}
                          />
                        </div>
                        {form.formState.errors.code && (
                          <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.code.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="percentage"
                          className="text-xs font-medium md:text-sm"
                        >
                          Discount Percentage
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <Percent className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <Input
                            id="percentage"
                            type="number"
                            min={1}
                            max={100}
                            className="h-8 pl-8 pr-8 text-xs md:h-9 md:text-sm"
                            {...form.register('percentage', {
                              valueAsNumber: true
                            })}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                        {form.formState.errors.percentage && (
                          <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.percentage.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="isActive"
                            className="text-xs font-medium md:text-sm"
                          >
                            Status
                          </Label>
                          <Controller
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="isActive"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {field.value ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            )}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground md:text-xs">
                          Active discounts can be applied at checkout
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discount Duration Card */}
                <Card className="overflow-hidden border-0 shadow-sm">
                  <CardHeader className="border-b bg-muted/20 p-4 md:px-5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <CardTitle className="text-sm font-medium md:text-base">
                        Discount Duration
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="startDate"
                          className="text-xs font-medium md:text-sm"
                        >
                          Start Date
                        </Label>
                        <Controller
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="startDate"
                                  variant="outline"
                                  className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                                    !field.value ? 'text-muted-foreground' : ''
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
                        {form.formState.errors.startDate && (
                          <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.startDate.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="endDate"
                          className="text-xs font-medium md:text-sm"
                        >
                          End Date{' '}
                          <span className="font-normal text-muted-foreground">
                            (Optional)
                          </span>
                        </Label>
                        <Controller
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="endDate"
                                  variant="outline"
                                  className={`h-8 w-full justify-start text-left text-xs md:h-9 md:text-sm ${
                                    !field.value ? 'text-muted-foreground' : ''
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
                                <div className="flex items-center justify-between border-b p-2">
                                  <span className="text-xs font-medium">
                                    Select end date
                                  </span>
                                  {field.value && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => field.onChange(null)}
                                    >
                                      <X className="mr-1 h-3 w-3" />
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <Calendar
                                  mode="single"
                                  selected={field.value || undefined}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date <
                                    (form.getValues().startDate || new Date())
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        {form.formState.errors.endDate && (
                          <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.endDate.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Creation Info */}
                {currentDiscount && (
                  <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      Created{' '}
                      {format(
                        new Date(currentDiscount.created_at || new Date()),
                        'PP'
                      )}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push('/vendors/dashboard/settings/discounts')
                    }
                    className="h-8 text-xs md:h-9 md:text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateDiscount.isPending}
                    className="relative h-8 text-xs md:h-9 md:text-sm"
                  >
                    {updateDiscount.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      </div>
                    )}
                    <Check className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                    {updateDiscount.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
