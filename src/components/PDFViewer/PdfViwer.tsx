'use client';

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PDFToolbar from "./PDFToolbar";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  bookTitle?: string;
}

const PdfViewer = ({ fileUrl, bookTitle = "Untitled Book" }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState<number | null>(null);

  const onDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    setLoading(false);

    const page = await pdf.getPage(1);
    setPageWidth(page.getViewport({ scale: 1 }).width);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
  };

  // Page navigation handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale * 1.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale / 1.25, 0.5));
  };

  const handleFitScreen = () => {
    setScale(1.0);
  };

  const handleZoomChange = (newScale: number) => {
    setScale(newScale);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header Toolbar */}
      <PDFToolbar
        bookTitle={bookTitle}
        currentPage={currentPage}
        numPages={numPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
        onPageChange={handlePageChange}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitScreen={handleFitScreen}
        onZoomChange={handleZoomChange}
      />

      {/* Main PDF Display Area */}
      <main className="flex-1 overflow-auto bg-[#0c0e12]">
        {loading && (
          <div className="flex h-full items-center justify-center text-text-muted">
            Loading PDF...
          </div>
        )}
        
        <div className={`relative z-10 mx-auto`} style={{
          maxWidth: pageWidth ? `${pageWidth}px` : undefined
        }}>
          <div className="overflow-hidden rounded-lg shadow-2xl">
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center p-8 text-text-muted">
                  Loading document...
                </div>
              }
              error={
                <div className="flex items-center justify-center p-8 text-red-500">
                  Failed to load PDF
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="w-full"
              />
            </Document>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfViewer;
