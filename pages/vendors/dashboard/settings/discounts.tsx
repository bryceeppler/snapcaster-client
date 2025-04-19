import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { vendorService } from '@/services/vendorService';
import { Discount, DiscountType } from '@/types/discounts';
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

// Form schema for discount validation
const discountFormSchema = z.object({
  code: z.string().min(3, {
    message: 'Discount code must be at least 3 characters.'
  }),
  percentage: z.coerce
    .number()
    .min(1, { message: 'Percentage must be at least 1%.' })
    .max(100, { message: 'Percentage cannot exceed 100%.' }),
  start_date: z.date(),
  end_date: z.date().nullable().optional()
});

type DiscountFormValues = z.infer<typeof discountFormSchema>;

export default function DiscountsPage() {
  const { getVendorById } = useVendors();
  const { profile } = useAuth();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);

  const vendor = getVendorById(profile?.data?.user.vendorData?.vendorId || 0); // This should be dynamic based on the logged-in vendor

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: '',
      percentage: 5,
      start_date: new Date(),
      end_date: null
    }
  });

  const editForm = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      code: '',
      percentage: 5,
      start_date: new Date(),
      end_date: null
    }
  });

  useEffect(() => {
    if (vendor) {
      fetchDiscounts();
    }
  }, [vendor, dateRange]);

  // Reset and populate edit form when current discount changes
  useEffect(() => {
    if (currentDiscount) {
      editForm.reset({
        code: currentDiscount.code,
        percentage: currentDiscount.discount_amount,
        start_date: new Date(currentDiscount.starts_at),
        end_date: currentDiscount.expires_at
          ? new Date(currentDiscount.expires_at)
          : null
      });
    }
  }, [currentDiscount, editForm]);

  const fetchDiscounts = async () => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      // This would be the actual API endpoint
      const discounts = await vendorService.fetchDiscountsByVendorId(
        vendor.id,
        true
      );

      // For demonstration, using placeholder data
      // In production, use: setDiscounts(response.data.data);
      setDiscounts(discounts);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast.error('Failed to fetch discounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: DiscountFormValues) => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      // This would be the actual API endpoint
      await vendorService.createDiscount({
        code: values.code,
        discount_amount: values.percentage,
        vendor_id: vendor.id,
        discount_type: DiscountType.PERCENTAGE,
        starts_at: values.start_date,
        expires_at: values.end_date || null
      });

      toast.success('Discount code created successfully.');

      // Refresh the discounts list
      fetchDiscounts();
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating discount:', error);
      toast.error('Failed to create discount. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onEditSubmit = async (values: DiscountFormValues) => {
    if (!vendor || !currentDiscount) return;

    setIsLoading(true);
    try {
      await vendorService.updateDiscount(currentDiscount.id, {
        code: values.code,
        discount_amount: values.percentage,
        discount_type: DiscountType.PERCENTAGE, // Currently only supporting percentage discounts
        starts_at: values.start_date,
        expires_at: values.end_date || null
      });

      toast.success('Discount code updated successfully.');

      // Refresh the discounts list
      fetchDiscounts();
      setIsEditDialogOpen(false);
      setCurrentDiscount(null);
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setCurrentDiscount(discount);
    setIsEditDialogOpen(true);
  };

  const deleteDiscount = async (discountId: number) => {
    if (!vendor) return;

    if (!confirm('Are you sure you want to delete this discount code?')) {
      return;
    }

    setIsLoading(true);
    try {
      await vendorService.deleteDiscount(discountId);
      toast.success('Discount code deleted successfully.');

      // Remove the deleted discount from state
      setDiscounts(discounts.filter((d) => d.id !== discountId));
    } catch (error) {
      console.error('Error deleting discount:', error);
      toast.error('Failed to delete discount. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (discount: Discount, newStatus: boolean) => {
    if (!vendor) return;

    setIsLoading(true);
    try {
      await vendorService.updateDiscount(discount.id, {
        is_active: newStatus
      });

      toast.success(
        `Discount code ${newStatus ? 'activated' : 'deactivated'} successfully.`
      );

      // Update the discount in the state
      setDiscounts(
        discounts.map((d) =>
          d.id === discount.id ? { ...d, is_active: newStatus } : d
        )
      );
    } catch (error) {
      console.error('Error updating discount status:', error);
      toast.error('Failed to update discount status. Please try again.');
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
                Discounts
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage discount codes for your customers
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Discount
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Discount Code</DialogTitle>
                    <DialogDescription>
                      Add a new discount code for your customers.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="code">Discount Code</Label>
                      <Input
                        id="code"
                        placeholder="e.g., SUMMER2023"
                        {...form.register('code')}
                      />
                      {form.formState.errors.code && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.code.message}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        The code your customers will enter at checkout.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="percentage">
                        Discount Percentage (%)
                      </Label>
                      <Input
                        id="percentage"
                        type="number"
                        min={1}
                        max={100}
                        {...form.register('percentage', {
                          valueAsNumber: true
                        })}
                      />
                      {form.formState.errors.percentage && (
                        <p className="text-sm font-medium text-destructive">
                          {form.formState.errors.percentage.message}
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
                        {isLoading ? 'Creating...' : 'Create Discount'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Edit Discount Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Discount Code</DialogTitle>
                <DialogDescription>
                  Update the discount code details.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={editForm.handleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Discount Code</Label>
                  <Input
                    id="edit-code"
                    placeholder="e.g., SUMMER2023"
                    {...editForm.register('code')}
                  />
                  {editForm.formState.errors.code && (
                    <p className="text-sm font-medium text-destructive">
                      {editForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-percentage">
                    Discount Percentage (%)
                  </Label>
                  <Input
                    id="edit-percentage"
                    type="number"
                    min={1}
                    max={100}
                    {...editForm.register('percentage', {
                      valueAsNumber: true
                    })}
                  />
                  {editForm.formState.errors.percentage && (
                    <p className="text-sm font-medium text-destructive">
                      {editForm.formState.errors.percentage.message}
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
                    {isLoading ? 'Updating...' : 'Update Discount'}
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
                      Loading discounts...
                    </p>
                  </div>
                </div>
              ) : discounts.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">
                    No discounts found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating a new discount code.
                  </p>
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Discount
                  </Button>
                </div>
              ) : (
                <div className="divide-y rounded-lg border">
                  {discounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="group p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{discount.code}</div>
                            <div
                              className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold ${
                                discount.is_active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {discount.is_active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <div className="mt-1">
                            <span className="inline-block rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                              {discount.discount_amount}% off
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={discount.is_active}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(discount, checked)
                            }
                            aria-label={`Toggle ${discount.code} status`}
                            disabled={isLoading}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-70 transition-opacity group-hover:opacity-100"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive opacity-70 transition-opacity group-hover:opacity-100"
                            onClick={() => deleteDiscount(discount.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 rounded-md bg-muted/50 p-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {format(new Date(discount.starts_at), 'PP')}
                            {discount.expires_at
                              ? ` → ${format(
                                  new Date(discount.expires_at),
                                  'PP'
                                )}`
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
                  <TableHead className="w-[150px]">Code</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Discount
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Start Date
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    End Date
                  </TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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
                          <CalendarIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No discounts found
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(true)}
                            className="mt-4"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Discount
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id} className="group">
                      <TableCell className="font-medium">
                        {discount.code}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                          {discount.discount_amount}%
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {format(new Date(discount.starts_at), 'PP')}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {discount.expires_at
                          ? format(new Date(discount.expires_at), 'PP')
                          : 'No end date'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={discount.is_active}
                            onCheckedChange={(checked) =>
                              handleStatusToggle(discount, checked)
                            }
                            aria-label={`Toggle ${discount.code} status`}
                            disabled={isLoading}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {discount.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-destructive opacity-70 transition-opacity hover:bg-red-50 group-hover:opacity-100"
                            onClick={() => deleteDiscount(discount.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
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
