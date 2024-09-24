import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSingleSearchStore } from "@/stores/useSingleSearchStore";

type Props = {};

const SinglePagination = (props: Props) => {
  const { currentPage, setCurrentPage, numPages, fetchCards } = useSingleSearchStore();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCards();
    window.scrollTo(0, 0);
    return;
  }
  
  return (
    <Pagination>
      <PaginationContent>
        {/* render previous button if available */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onMouseDown={() => handlePageChange(currentPage - 1)}/>
          </PaginationItem>
        )}

        {/* render previous page ref if available */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink onMouseDown={() => handlePageChange(currentPage - 1)}>{currentPage - 1}</PaginationLink>
          </PaginationItem>
        )}

        {/* render current page btn */}
        <PaginationItem>
          <PaginationLink isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* next page if avail */}
        {numPages && currentPage + 1 <= numPages && (<PaginationItem>
          <PaginationLink onMouseDown={() => handlePageChange(currentPage + 1)}>{currentPage + 1}</PaginationLink>
        </PaginationItem>)}

        {/* elipses if avail */}
        {numPages && currentPage + 1 < numPages  && (<PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>)}

        {/* next button if avail */}
        {numPages && currentPage < numPages && (
          <PaginationItem>
            <PaginationNext onMouseDown={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        )}

      </PaginationContent>
    </Pagination>
  );
};

export default SinglePagination;
