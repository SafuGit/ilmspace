import React from 'react';
import Link from 'next/link';
import PageNavigation from './PageNavigation';
import ZoomControls from './ZoomControls';

interface PDFToolbarProps {
  bookTitle: string;
  currentPage: number;
  numPages: number | null;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onZoomChange: (scale: number) => void;
}

const PDFToolbar = ({
  bookTitle,
  currentPage,
  numPages,
  onPreviousPage,
  onNextPage,
  onPageChange,
  scale,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onZoomChange,
}: PDFToolbarProps) => {
  return (
    <header className="relative z-20 flex h-16 w-full shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-b-border bg-background-dark px-4 shadow-md sm:px-6">
      {/* Left Section - Back Button */}
      <div className="flex items-center gap-2">
        <Link 
          href="/dashboard"
          className="flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-card-bg px-3 text-sm font-medium text-white transition-colors hover:bg-border"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
      </div>

      {/* Center Section - Book Title & Page Navigation */}
      <PageNavigation
        bookTitle={bookTitle}
        currentPage={currentPage}
        numPages={numPages}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onPageChange={onPageChange}
      />

      {/* Right Section - Zoom & More Actions */}
      <ZoomControls
        scale={scale}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onFitScreen={onFitScreen}
        onZoomChange={onZoomChange}
      />
    </header>
  );
};

export default PDFToolbar;
