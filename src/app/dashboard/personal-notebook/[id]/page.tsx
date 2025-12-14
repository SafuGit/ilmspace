"use client";
import PersonalNotebook from "@/components/PersonalNotebook/PersonalNotebook";
import { useParams } from "next/navigation";

export default function PersonalNotebookPage() {
  const params = useParams();
  const id = params.id as string;

  return <PersonalNotebook notebookId={id} />;
}