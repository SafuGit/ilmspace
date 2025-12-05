import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { NextResponse } from "next/server";
import path from "path";
import { pathToFileURL } from "url";
import { pdf } from "pdf-to-img";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const workerPath = path.join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "legacy",
  "build",
  "pdf.worker.mjs"
);
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

export async function POST(request: Request) {
  try {
    console.log("[generate-thumbnail] Starting thumbnail generation");
    
    const session = await serverAuth();
    if (!session) {
      console.log("[generate-thumbnail] ERROR: No session found");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    console.log("[generate-thumbnail] Session verified");

    const userId = await getUserId(session.user!.email!);
    if (!userId) {
      console.log("[generate-thumbnail] ERROR: No userId found");
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    console.log("[generate-thumbnail] UserId:", userId);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      console.log("[generate-thumbnail] ERROR: No file in formData");
      return NextResponse.json({ error: "NO FILE PROVIDED." }, { status: 400 });
    }
    console.log("[generate-thumbnail] File received - Name:", file.name, "Type:", file.type, "Size:", file.size);

    console.log("[generate-thumbnail] Converting file to buffer");
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("[generate-thumbnail] Buffer created - Size:", buffer.length);

    console.log("[generate-thumbnail] Processing PDF with pdf-to-img library");
    const document = await pdf(buffer, { scale: 2 });
    console.log("[generate-thumbnail] PDF loaded - Total pages:", document.length);
    
    console.log("[generate-thumbnail] Extracting first page");
    const firstPage = await document.getPage(1);
    console.log("[generate-thumbnail] First page extracted - Size:", firstPage.length);

    console.log("[generate-thumbnail] Returning image response");
    return new Response(new Uint8Array(firstPage).buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': firstPage.length.toString(),
      }
    });

  } catch (error) {
    console.error("[generate-thumbnail] ERROR occurred:");
    console.error("[generate-thumbnail] Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("[generate-thumbnail] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("[generate-thumbnail] Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return NextResponse.json({ 
      error: "INTERNAL SERVER ERROR in /books/generate-thumbnail", 
      message: error instanceof Error ? error.message : String(error),
      log: error 
    }, { status: 500 });
  }
}