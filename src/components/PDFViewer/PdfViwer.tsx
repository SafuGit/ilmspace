'use client';

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer = ({ fileUrl }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background-dark p-4">
      {loading && (
        <div className="text-text-muted">Loading PDF...</div>
      )}
      
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="text-text-muted">Loading document...</div>}
        error={<div className="text-red-500">Failed to load PDF</div>}
      >
        <Page
          pageNumber={1}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="shadow-lg"
        />
      </Document>

      {numPages && (
        <p className="mt-4 text-text-muted">
          Page 1 of {numPages}
        </p>
      )}
    </div>
  );
};

export default PdfViewer;
