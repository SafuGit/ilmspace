"use client";

import { useParams } from "next/navigation";
import DarsViewer from "@/components/Dars/DarsViewer";

export default function DarsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-background-dark">
      <DarsViewer videoId={id} />
    </div>
  );
}
