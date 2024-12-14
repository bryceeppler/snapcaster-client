import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

type Props = {
  currentPage: number;
  setCurrentPage: (value: number) => void;
  numPages: number | null;
  fetchCards: () => void;
};
const SinglePagination = ({
  currentPage,
  setCurrentPage,
  numPages,
  fetchCards
}: Props) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCards();
    window.scrollTo(0, 0);
    return;
  };

  return (
    <Pagination className="w-min">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onMouseDown={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
        )}
        {currentPage > 1 && (
          <PaginationItem className="cursor-pointer">
            <PaginationLink
              onMouseDown={() => handlePageChange(currentPage - 1)}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className="cursor-default">
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {typeof numPages === 'number' &&
          numPages > 1 &&
          currentPage + 1 <= numPages && (
            <PaginationItem className="cursor-pointer">
              <PaginationLink
                onMouseDown={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
        {typeof numPages === 'number' &&
          numPages > 1 &&
          currentPage + 1 < numPages && (
            <PaginationItem className="">
              <PaginationEllipsis />
            </PaginationItem>
          )}
        {typeof numPages === 'number' &&
          numPages > 1 &&
          currentPage < numPages && (
            <PaginationItem className="cursor-pointer">
              <PaginationNext
                onMouseDown={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
      </PaginationContent>
    </Pagination>
  );
};
export default SinglePagination;
