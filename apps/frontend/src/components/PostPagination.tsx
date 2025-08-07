import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { calculatePageNumbers } from "@/lib/helpers";
import { cn } from "@/lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
  visibleRange?: number;
  className?: string;
};

export default function PostPagination({
  totalPages,
  currentPage,
  visibleRange = 2,
  className,
}: Props) {
  const pageNumbers = calculatePageNumbers({
    visibleRange,
    currentPage,
    totalPages,
  });

  return (
    <div className={cn("flex justify-center mt-10", className)}>
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`?page=${currentPage - 1}`} />
            </PaginationItem>
          )}

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={`?page=${page}`}
                  isActive={currentPage === page}
                  className={cn({
                    "bg-blue-500 text-white hover:bg-blue-600":
                      currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next button */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={`?page=${currentPage + 1}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
