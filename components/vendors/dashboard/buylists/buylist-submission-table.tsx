import React from 'react';
import { BuylistSubmissionResponse } from '@/services/catalogService';
import {
  TableScrollable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useVendors } from '@/hooks/queries/useVendors';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {
  data: BuylistSubmissionResponse;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const BuylistSubmissionTable = ({
  data,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}: Props) => {
  const { getVendorNameBySlug } = useVendors();

  // Calculate page numbers to display
  const { totalPages, currentPage: apiCurrentPage } = data.pagination;

  // Calculate the range of items being displayed
  const startItem = (apiCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(
    apiCurrentPage * pageSize,
    data.pagination.totalItems
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push(null); // Add ellipsis
      }

      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(null); // Add ellipsis
      }

      // Always include last page if not already included
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Make sure we're handling the case where there are no submissions
  const hasSubmissions = data.submissions && data.submissions.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {hasSubmissions
            ? `Showing ${startItem} to ${endItem} of ${data.pagination.totalItems} entries`
            : `0 entries found`}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TableScrollable>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Cart ID</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Total Cards</TableHead>
            <TableHead>Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!hasSubmissions ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          ) : (
            data.submissions.map((submission) => (
              <TableRow key={submission.timestamp}>
                <TableCell>{submission.userId}</TableCell>
                <TableCell>{submission.cartId}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(submission.timestamp), {
                    addSuffix: true
                  })}
                </TableCell>
                <TableCell>
                  {submission.status === 'success' ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Success
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      Failed
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {getVendorNameBySlug(submission.vendorSlug)}
                </TableCell>
                <TableCell>{submission.paymentType}</TableCell>
                <TableCell>{submission.totalCards}</TableCell>
                <TableCell>{submission.totalValue.toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableScrollable>

      {totalPages > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {getPageNumbers().map((pageNumber, index) =>
              pageNumber === null ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => onPageChange(pageNumber as number)}
                    className="cursor-pointer"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BuylistSubmissionTable;
