import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface GamePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GamePagination({
  currentPage,
  totalPages,
  onPageChange,
}: GamePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages: number[] = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav aria-label="Game pagination" className="flex justify-center items-center gap-1 sm:gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-8 sm:h-9"
      >
        <ChevronLeft className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="flex items-center px-1 text-muted-foreground">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={page === currentPage ? `Current page, page ${page}` : `Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="flex items-center px-1 text-muted-foreground">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-8 sm:h-9"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4 sm:ml-1" />
      </Button>
    </nav>
  );
}
