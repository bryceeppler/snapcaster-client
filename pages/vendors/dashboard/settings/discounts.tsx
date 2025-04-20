import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
  Store
} from 'lucide-react';
import { useState, useEffect, useCallback, memo } from 'react';
import { subDays, format } from 'date-fns';
import { z } from 'zod';
import DashboardLayout from '../layout';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { useVendors } from '@/hooks/queries/useVendors';
import { toast } from 'sonner';
import { Discount } from '@/types/discounts';
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
import { useDiscounts } from '@/hooks/queries/useDiscounts';

import { useRouter } from 'next/router';
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

// Create a memoized component for individual discount rows
const DiscountRow = memo(
  ({
    discount,
    onEdit,
    onDelete,
    onToggleStatus,
    isAdmin,
    getVendorName
  }: {
    discount: Discount;
    onEdit: (discount: Discount) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (discount: Discount, status: boolean) => void;
    isAdmin: boolean;
    getVendorName: (vendorId: number) => string;
  }) => {
    return (
      <TableRow className="group">
        <TableCell className="font-medium">{discount.code}</TableCell>
        {isAdmin && (
          <TableCell className="hidden text-muted-foreground md:table-cell">
            {getVendorName(discount.vendor_id)}
          </TableCell>
        )}
        <TableCell className="hidden md:table-cell">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            {discount.discount_amount}%
          </span>
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {format(new Date(discount.starts_at), 'PP')}
        </TableCell>
        <TableCell className="hidden text-muted-foreground md:table-cell">
          {discount.expires_at
            ? format(new Date(discount.expires_at), 'PP')
            : 'Never'}
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Switch
              checked={discount.is_active}
              onCheckedChange={(checked) => onToggleStatus(discount, checked)}
              aria-label={`Toggle ${discount.code} status`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {discount.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-fit opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(discount)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(discount.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
    );
  },
  (
    prevProps: {
      discount: Discount;
      onEdit: Function;
      onDelete: Function;
      onToggleStatus: Function;
      isAdmin: boolean;
      getVendorName: Function;
    },
    nextProps: {
      discount: Discount;
      onEdit: Function;
      onDelete: Function;
      onToggleStatus: Function;
      isAdmin: boolean;
      getVendorName: Function;
    }
  ) => {
    return (
      prevProps.discount.id === nextProps.discount.id &&
      prevProps.discount.is_active === nextProps.discount.is_active &&
      prevProps.discount.code === nextProps.discount.code &&
      prevProps.discount.discount_amount ===
        nextProps.discount.discount_amount &&
      prevProps.isAdmin === nextProps.isAdmin
    );
  }
);

// For consistent equality check in memo
DiscountRow.displayName = 'DiscountRow';

// Create a memoized component for mobile view discount cards
const MobileDiscountCard = memo(
  ({
    discount,
    onEdit,
    onDelete,
    onToggleStatus,
    isAdmin,
    getVendorName
  }: {
    discount: Discount;
    onEdit: (discount: Discount) => void;
    onDelete: (id: number) => void;
    onToggleStatus: (discount: Discount, status: boolean) => void;
    isAdmin: boolean;
    getVendorName: (vendorId: number) => string;
  }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="group border-b p-3 transition-colors hover:bg-muted/50">
        {/* Main card content - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {/* Code and status badge */}
            <div className="flex items-center gap-1.5">
              <p className="max-w-[120px] truncate text-sm font-medium">
                {discount.code}
              </p>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                {discount.discount_amount}%
              </span>
            </div>

            {/* Vendor (admin only) */}
            {isAdmin && (
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                {getVendorName(discount.vendor_id)}
              </div>
            )}

            {/* Status indicator */}
            <div className="mt-0.5 flex items-center">
              <div
                className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${
                  discount.is_active ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-[10px] text-muted-foreground">
                {discount.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Toggle and actions */}
          <div className="flex items-center">
            <Switch
              className="scale-75"
              checked={discount.is_active}
              onCheckedChange={(checked) => onToggleStatus(discount, checked)}
              aria-label={`Toggle ${discount.code} status`}
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
            {/* Date information */}
            <div className="mb-3 flex text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 mt-0.5 h-3 w-3 flex-shrink-0" />
              <div>
                <div>From: {format(new Date(discount.starts_at), 'PP')}</div>
                {discount.expires_at && (
                  <div>
                    Until: {format(new Date(discount.expires_at), 'PP')}
                  </div>
                )}
                {!discount.expires_at && <div>No expiration date</div>}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 flex-1 text-xs"
                onClick={() => onEdit(discount)}
              >
                <Pencil className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 flex-1 border-destructive/30 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(discount.id)}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
  (
    prevProps: {
      discount: Discount;
      onEdit: Function;
      onDelete: Function;
      onToggleStatus: Function;
      isAdmin: boolean;
      getVendorName: Function;
    },
    nextProps: {
      discount: Discount;
      onEdit: Function;
      onDelete: Function;
      onToggleStatus: Function;
      isAdmin: boolean;
      getVendorName: Function;
    }
  ) => {
    return (
      prevProps.discount.id === nextProps.discount.id &&
      prevProps.discount.is_active === nextProps.discount.is_active &&
      prevProps.discount.code === nextProps.discount.code &&
      prevProps.discount.discount_amount ===
        nextProps.discount.discount_amount &&
      prevProps.isAdmin === nextProps.isAdmin
    );
  }
);

MobileDiscountCard.displayName = 'MobileDiscountCard';

export default function DiscountsPage() {
  const router = useRouter();
  const { getVendorById, vendors } = useVendors();
  const { profile } = useAuth();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Get the vendor ID from the user profile
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;
  console.log('Profile data:', profile?.data);
  console.log('Vendor ID from profile:', vendorId);

  // Get admin status
  const isAdmin = profile?.data?.user.role === 'ADMIN';
  console.log('User is admin:', isAdmin);

  // Get the vendor information (only needed for non-admin users)
  const vendor = getVendorById(vendorId);
  console.log('Vendor data:', vendor);

  // Helper function to get vendor name from ID
  const getVendorName = (vendorId: number): string => {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.name : `Unknown Vendor (ID: ${vendorId})`;
  };

  const {
    getDiscountsByVendorId,
    getLargestActiveDiscountByVendorSlug,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    isLoading,
    discounts: allDiscounts
  } = useDiscounts();

  // If user is admin, show all discounts, otherwise filter by vendor ID
  const discounts = isAdmin
    ? allDiscounts
    : getDiscountsByVendorId(vendor?.id || null);

  const largestActiveDiscount = getLargestActiveDiscountByVendorSlug(
    vendor?.slug || ''
  );

  // Notify admin users of their elevated privileges
  useEffect(() => {
    if (isAdmin) {
      toast.info('Admin mode: You can edit discounts for all vendors', {
        duration: 4000,
        id: 'admin-discount-notification' // Prevent duplicate toasts
      });
    }
  }, [isAdmin]);

  // Navigation handlers for our new pages
  const handleAddDiscount = () => {
    router.push('/vendors/dashboard/settings/discounts/new');
  };

  const handleEditDiscount = (discount: Discount) => {
    router.push(`/vendors/dashboard/settings/discounts/edit/${discount.id}`);
  };

  const handleDeleteDiscount = useCallback(
    async (discountId: number) => {
      // Skip vendor check for admins
      if (!isAdmin && !vendor) {
        toast.error('Vendor information is not available');
        return;
      }

      if (!confirm('Are you sure you want to delete this discount code?')) {
        return;
      }

      try {
        console.log('Deleting discount:', { discountId, isAdmin });
        await deleteDiscount.mutateAsync(discountId);
      } catch (error) {
        console.error('Error deleting discount:', error);
        toast.error('Failed to delete discount.');
      }
    },
    [isAdmin, vendor, deleteDiscount]
  );

  const handleStatusToggle = useCallback(
    async (discount: Discount, newStatus: boolean) => {
      // Skip vendor check for admins
      if (!isAdmin && !vendor) {
        toast.error('Vendor information is not available');
        return;
      }

      try {
        await updateDiscount.mutateAsync({
          id: discount.id,
          data: { is_active: newStatus }
        });
      } catch (error) {
        console.error('Error updating discount status:', error);
        toast.error('Failed to update discount status');
      }
    },
    [isAdmin, vendor, updateDiscount]
  );

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-6 pt-8 md:p-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Discounts{' '}
                {isAdmin && (
                  <span className="text-lg text-blue-600">(Admin Mode)</span>
                )}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                  ? 'Manage discount codes across all vendors'
                  : 'Manage discount codes for your customers'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="shadow-sm" onClick={handleAddDiscount}>
                <Plus className="mr-2 h-4 w-4" />
                Add Discount
              </Button>
            </div>
          </div>

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
                  <Button onClick={handleAddDiscount} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Discount
                  </Button>
                </div>
              ) : (
                <div className="divide-y rounded-lg border">
                  {discounts.map((discount) => (
                    <MobileDiscountCard
                      key={discount.id}
                      discount={discount}
                      onEdit={handleEditDiscount}
                      onDelete={handleDeleteDiscount}
                      onToggleStatus={handleStatusToggle}
                      isAdmin={isAdmin}
                      getVendorName={getVendorName}
                    />
                  ))}
                </div>
              )}
            </div>

            <Table className="hidden md:table">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead className="w-[150px]">Code</TableHead>
                  {isAdmin && (
                    <TableHead className="hidden md:table-cell">
                      Vendor
                    </TableHead>
                  )}
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
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
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
                          <CalendarIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No discounts found
                          </p>
                          <Button
                            variant="outline"
                            onClick={handleAddDiscount}
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
                    <DiscountRow
                      key={discount.id}
                      discount={discount}
                      onEdit={handleEditDiscount}
                      onDelete={handleDeleteDiscount}
                      onToggleStatus={handleStatusToggle}
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
