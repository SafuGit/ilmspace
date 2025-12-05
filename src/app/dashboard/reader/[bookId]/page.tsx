"use client";

import { fetcher } from '@/lib/fetcher';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

const PdfViewer = dynamic(() => import('@/components/PDFViewer/PdfViwer'), {
  ssr: false,
  loading: () => <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-text-muted">Loading PDF Viewer...</div>
});


const PdfViewerPage = () => {
  const bookId = useParams().bookId;
  const { data } = useSWR<{ secureUrl: string; title: string }>(`/api/books/get-url/${bookId}`, fetcher);
  
  if (!data) {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-background-dark text-text-muted">Loading PDF URL...</div>;
  }

  console.log("PDF URL:", data);

  return <PdfViewer fileUrl={data.secureUrl} bookTitle={data.title} />
};

export default PdfViewerPage;