import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Tag,
  Percent,
  Clock,
  ArrowLeft,
  Plus,
  X,
  Store
} from 'lucide-react';

import DashboardLayout from '../../layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useVendors } from '@/hooks/queries/useVendors';
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { DiscountType } from '@/types/discounts';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Form schema for discount validation
const discountFormSchema = z.object({
  code: z.string().min(3, {
    message: 'Discount code must be at least 3 characters.'
  }),
  percentage: z.coerce
    .number()
    .int({ message: 'Percentage must be an integer (no decimals allowed).' })
    .min(1, { message: 'Percentage must be at least 1%.' })
    .max(100, { message: 'Percentage cannot exceed 100%.' }),
  start_date: z.date(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  vendor_id: z.coerce.number().positive({
    message: 'Please select a vendor'
  })
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

export default function NewDiscountPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { vendors, getVendorById } = useVendors();
  const { createDiscount } = useDiscounts();

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
      start_date: new Date(),
      end_date: null,
      is_active: true,
      vendor_id: isAdmin ? 0 : vendor?.id || 0
    }
  });

  // Update form values when vendor is loaded or admin status changes
  useEffect(() => {
    if (!isAdmin && vendor) {
      form.setValue('vendor_id', vendor.id);
    }
  }, [isAdmin, vendor, form]);

  const onSubmit = async (values: DiscountFormValues) => {
    // For admin users, ensure a vendor is selected
    if (isAdmin && (!values.vendor_id || values.vendor_id === 0)) {
      toast.error('Please select a vendor for this discount code');
      return;
    }

    // For regular users, ensure vendor info is available
    if (!isAdmin && !vendor) {
      toast.error('Vendor information is not available');
      return;
    }

    try {
      const vendorIdToUse = isAdmin ? values.vendor_id : vendor?.id || 0;

      if (vendorIdToUse === 0) {
        toast.error('Invalid vendor ID');
        return;
      }

      await createDiscount.mutateAsync({
        code: values.code.toUpperCase(),
        discount_amount: values.percentage,
        vendor_id: vendorIdToUse,
        discount_type: DiscountType.PERCENTAGE,
        starts_at: values.start_date,
        expires_at: values.end_date || null,
        is_active: values.is_active
      });

      toast.success('Discount code created successfully');
      router.push('/vendors/dashboard/settings/discounts');
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount. Please try again.');
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
                Create Discount Code
                {isAdmin && (
                  <span className="ml-2 text-sm text-blue-600">(Admin)</span>
                )}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a new discount code for your customers
              </p>
            </div>
          </div>

          {/* Simplified layout */}
          <div className="mx-auto w-full max-w-2xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    {/* Vendor selection (admin only) */}
                    {isAdmin && (
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="vendor_id"
                          className="text-xs font-medium md:text-sm"
                        >
                          Vendor
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <Store className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <Controller
                            control={form.control}
                            name="vendor_id"
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                                value={
                                  field.value ? field.value.toString() : ''
                                }
                              >
                                <SelectTrigger className="h-8 pl-8 text-xs md:h-9 md:text-sm">
                                  <SelectValue placeholder="Select a vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vendors
                                    .filter((v) => v.is_active)
                                    .map((vendor) => (
                                      <SelectItem
                                        key={vendor.id}
                                        value={vendor.id.toString()}
                                        className="text-xs md:text-sm"
                                      >
                                        {vendor.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        {form.formState.errors.vendor_id && (
                          <p className="text-xs font-medium text-destructive">
                            {form.formState.errors.vendor_id.message}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground md:text-xs">
                          Select the vendor this discount code will apply to
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
                          placeholder="e.g. SNAPCASTER5"
                          className="h-8 pl-8 text-xs uppercase md:h-9 md:text-sm"
                          {...form.register('code')}
                        />
                      </div>
                      {form.formState.errors.code && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.code.message}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground md:text-xs">
                        The code customers will enter at checkout (automatically
                        converted to uppercase)
                      </p>
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
                          step={1}
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
                      <p className="text-[10px] text-muted-foreground md:text-xs">
                        Enter a whole number between 1 and 100 (no decimals)
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="is_active"
                          className="text-xs font-medium md:text-sm"
                        >
                          Status
                        </Label>
                        <Controller
                          control={form.control}
                          name="is_active"
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="is_active"
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
                        htmlFor="start_date"
                        className="text-xs font-medium md:text-sm"
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
                      {form.formState.errors.start_date && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.start_date.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="end_date"
                        className="text-xs font-medium md:text-sm"
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
                                  (form.getValues().start_date || new Date())
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      {form.formState.errors.end_date && (
                        <p className="text-xs font-medium text-destructive">
                          {form.formState.errors.end_date.message}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground md:text-xs">
                        Leave blank for a discount that never expires
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                  disabled={createDiscount.isPending}
                  className="relative h-8 text-xs md:h-9 md:text-sm"
                >
                  {createDiscount.isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    </div>
                  )}
                  <Plus className="mr-1.5 h-3 w-3 md:h-3.5 md:w-3.5" />
                  {createDiscount.isPending ? 'Creating...' : 'Create Discount'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
