import React, { useState } from 'react';

interface PageNavigationProps {
  bookTitle: string;
  currentPage: number;
  numPages: number | null;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

const PageNavigation = ({
  bookTitle,
  currentPage,
  numPages,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: PageNavigationProps) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && numPages && pageNum >= 1 && pageNum <= numPages) {
      onPageChange(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  // Update input when currentPage changes externally
  React.useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  return (
    <div className="flex flex-1 items-center justify-center gap-2 px-2 sm:gap-4">
      <button 
        onClick={onPreviousPage}
        className="flex size-10 items-center justify-center rounded-lg bg-card-bg text-[#d1d5db] transition-colors hover:bg-border hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </button>
      
      <div className="flex flex-col items-center text-center">
        <h1 className="text-sm font-semibold sm:text-base truncate max-w-[150px] sm:max-w-xs">
          {bookTitle}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <input 
            className="w-10 rounded border-none bg-transparent p-0 text-center text-white focus:ring-0 focus:outline-none" 
            type="text" 
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageInputKeyDown}
            aria-label="Current page"
          />
          <span>/</span>
          <span>{numPages || '...'}</span>
        </div>
      </div>
      
      <button 
        onClick={onNextPage}
        className="flex size-10 items-center justify-center rounded-lg bg-card-bg text-[#d1d5db] transition-colors hover:bg-border hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        disabled={!numPages || currentPage >= numPages}
        aria-label="Next page"
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </div>
  );
};

export default PageNavigation;
