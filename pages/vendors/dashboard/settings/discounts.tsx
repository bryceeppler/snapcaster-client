import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useState, useCallback, memo, useMemo } from 'react';
import { toast } from 'sonner';

import DashboardLayout from '../layout';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useDiscounts } from '@/hooks/queries/useDiscounts';
import { useVendors } from '@/hooks/queries/useVendors';
import { useAuth } from '@/hooks/useAuth';
import type { Discount } from '@/types/discounts';

// Reusable loading skeleton component
const TableLoadingSkeleton = ({ isAdmin = false }: { isAdmin?: boolean }) => (
  <div className="w-full space-y-2 p-4">
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-8 w-24" />
          {isAdmin && <Skeleton className="h-8 w-32" />}
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="ml-auto h-8 w-8" />
        </div>
      ))}
    </div>
  </div>
);

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
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <span>{discount.code}</span>
          </div>
        </TableCell>
        {isAdmin && (
          <TableCell className="hidden text-muted-foreground md:table-cell">
            <div className="flex items-center gap-2">
              {getVendorName(discount.vendor_id)}
            </div>
          </TableCell>
        )}
        <TableCell className="hidden md:table-cell">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            {discount.discount_amount}%
          </span>
        </TableCell>
        <TableCell className="hidden text-muted-foreground lg:table-cell">
          {format(new Date(discount.starts_at), 'PP')}
        </TableCell>
        <TableCell className="hidden text-muted-foreground lg:table-cell">
          {discount.expires_at
            ? format(new Date(discount.expires_at), 'PP')
            : 'Never'}
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Switch
              checked={discount.is_active}
              onCheckedChange={(checked) => onToggleStatus(discount, checked)}
              aria-label={`${
                discount.is_active ? 'Deactivate' : 'Activate'
              } discount code ${discount.code}`}
              id={`toggle-${discount.id}`}
            />
            <VisuallyHidden>
              <label htmlFor={`toggle-${discount.id}`}>
                {discount.is_active ? 'Active' : 'Inactive'}
              </label>
            </VisuallyHidden>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-8 w-8 items-center justify-center p-0 opacity-70 transition-opacity hover:bg-muted group-hover:opacity-100"
                  aria-label="Actions for discount code"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onEdit(discount)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onEdit(discount);
                    }
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(discount.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onDelete(discount.id);
                    }
                  }}
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

    const toggleExpanded = useCallback(() => {
      setExpanded((prev) => !prev);
    }, []);

    return (
      <div
        className="group border-b p-4 transition-colors hover:bg-muted/50"
        role="region"
        aria-expanded={expanded}
      >
        {/* Main card content - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {/* Code and status badge */}
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{discount.code}</p>
            </div>

            {/* Discount amount */}
            <div className="mt-1">
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                {discount.discount_amount}%
              </span>
            </div>

            {/* Vendor (admin only) */}
            {isAdmin && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {getVendorName(discount.vendor_id)}
              </div>
            )}
          </div>

          {/* Toggle and actions */}
          <div className="flex items-center gap-2">
            <Switch
              checked={discount.is_active}
              onCheckedChange={(checked) => onToggleStatus(discount, checked)}
              aria-label={`${
                discount.is_active ? 'Deactivate' : 'Activate'
              } discount code ${discount.code}`}
              id={`mobile-toggle-${discount.id}`}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-label={expanded ? 'Show less details' : 'Show more details'}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Expandable section - only visible when expanded */}
        {expanded && (
          <div className="mt-3 rounded-md bg-muted/30 p-3">
            {/* Date information */}
            <div className="mb-3 flex text-xs text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
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
                className="flex-1"
                onClick={() => onEdit(discount)}
              >
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(discount.id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

MobileDiscountCard.displayName = 'MobileDiscountCard';

// Empty state component
const EmptyState = ({ onAddDiscount }: { onAddDiscount: () => void }) => (
  <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <CalendarIcon className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="mt-4 text-lg font-medium">No discounts found</h3>
    <p className="mt-2 text-sm text-muted-foreground">
      Get started by creating a new discount code.
    </p>
    <Button onClick={onAddDiscount} className="mt-4">
      <Plus className="mr-2 h-4 w-4" />
      Add Discount
    </Button>
  </div>
);

export default function DiscountsPage() {
  const router = useRouter();
  const { getVendorById, vendors } = useVendors();
  const { profile } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null);

  // Get the vendor ID from the user profile
  const vendorId = profile?.data?.user.vendorData?.vendorId || 0;

  // Get admin status
  const isAdmin = profile?.data?.user.role === 'ADMIN';

  // Get the vendor information (only needed for non-admin users)
  const vendor = getVendorById(vendorId);

  // Helper function to get vendor name from ID
  const getVendorName = useCallback(
    (vendorId: number): string => {
      const vendor = vendors.find((v) => v.id === vendorId);
      return vendor ? vendor.name : `Unknown Vendor (ID: ${vendorId})`;
    },
    [vendors]
  );

  const {
    getDiscountsByVendorId,
    updateDiscount,
    deleteDiscount,
    isLoading,
    isError,
    discounts: allDiscounts
  } = useDiscounts();

  // If user is admin, show all discounts, otherwise filter by vendor ID
  const discounts = useMemo(() => {
    return isAdmin ? allDiscounts : getDiscountsByVendorId(vendor?.id || null);
  }, [isAdmin, allDiscounts, getDiscountsByVendorId, vendor]);

  // Navigation handlers for our new pages
  const handleAddDiscount = useCallback(() => {
    router.push('/vendors/dashboard/settings/discounts/new');
  }, [router]);

  const handleEditDiscount = useCallback(
    (discount: Discount) => {
      router.push(`/vendors/dashboard/settings/discounts/edit/${discount.id}`);
    },
    [router]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!discountToDelete) return;

    try {
      await deleteDiscount.mutateAsync(discountToDelete);
      toast.success('Discount deleted successfully');
    } catch {
      toast.error('Failed to delete discount');
    } finally {
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
    }
  }, [discountToDelete, deleteDiscount]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
    setDiscountToDelete(null);
  }, []);

  const handleDeleteDiscount = useCallback((discountId: number) => {
    setDiscountToDelete(discountId);
    setDeleteDialogOpen(true);
  }, []);

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

        toast.success(
          `Discount code ${newStatus ? 'activated' : 'deactivated'}`
        );
      } catch {
        toast.error('Failed to update discount status');
      }
    },
    [isAdmin, vendor, updateDiscount]
  );

  // Render the page with improved error handling
  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-medium">Error loading discounts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There was a problem loading your discount codes.
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6">
          {/* Header section */}
          <header className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight md:text-3xl"
                id="page-title"
              >
                Discounts{' '}
                {isAdmin && (
                  <Badge className="ml-2 bg-primary/10 text-primary">
                    Admin
                  </Badge>
                )}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                  ? 'Manage discount codes across all vendors'
                  : 'Manage discount codes for your customers'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="shadow-sm"
                onClick={handleAddDiscount}
                aria-label="Add new discount code"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Discount
              </Button>
            </div>
          </header>

          {/* Mobile view */}
          <section
            className="rounded-md border md:hidden"
            aria-labelledby="mobile-discounts-heading"
          >
            <h2 id="mobile-discounts-heading" className="sr-only">
              Discounts List
            </h2>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p
                    className="text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    Loading discounts...
                  </p>
                </div>
              </div>
            ) : discounts.length === 0 ? (
              <EmptyState onAddDiscount={handleAddDiscount} />
            ) : (
              <div className="divide-y rounded-lg border" role="list">
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
          </section>

          {/* Desktop view table */}
          <section
            className="hidden rounded-md border md:block"
            aria-labelledby="desktop-discounts-heading"
          >
            <h2 id="desktop-discounts-heading" className="sr-only">
              Discounts Table
            </h2>
            <Table className="hidden rounded-md bg-card md:table">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted">
                  <TableHead className="">Code</TableHead>
                  {isAdmin && (
                    <TableHead className="hidden md:table-cell">
                      Vendor
                    </TableHead>
                  )}
                  <TableHead className="hidden md:table-cell">
                    Discount
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Start Date
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    End Date
                  </TableHead>
                  <TableHead className="">Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6}>
                      <TableLoadingSkeleton isAdmin={isAdmin} />
                    </TableCell>
                  </TableRow>
                ) : discounts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isAdmin ? 7 : 6}
                      className="h-24 text-center"
                    >
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
          </section>
        </div>
      </main>

      {/* Confirmation dialog for delete action */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this discount code? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
