/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function formatTimestampSecs(secs: number) {
  if (!Number.isFinite(secs)) return String(secs);
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((secs / 60) % 60)
    .toString()
    .padStart(2, "0");
  const h = Math.floor(secs / 3600).toString();
  return h !== "0" ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return new Response("Request body is missing", { status: 400 });
    }
    const { userId, playlistId, videoId, content, timestamp, notebookId } = body;

    if (!userId || !notebookId || content == null || timestamp === undefined) {
      return new Response("Missing required fields", { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newNote = await tx.timestampNote.create({
        data: {
          userId,
          playlistId: playlistId || null,
          videoId: videoId || null,
          content,
          timestamp,
          notebookId,
        },
      });

      let playlistName: string | null = null;
      if (playlistId) {
        const pl = await tx.playlist.findUnique({ where: { id: playlistId } });
        playlistName = pl?.name ?? null;
      }

      const lastPage = await tx.page.findFirst({
        where: { notebookId },
        orderBy: { pageNumber: "desc" },
      });

      const timestampLine = `${formatTimestampSecs(Number(timestamp))}${playlistName ? ` (${playlistName})` : ""}`;
      const createdAtLine = new Date().toISOString();

      // Wrap content into lines of max 53 chars (word-wrap)
      const wrapText = (text: string, max = 53) => {
        const words = text.split(/\s+/).filter(Boolean);
        const lines: string[] = [];
        let cur = "";
        for (const w of words) {
          if ((cur + (cur ? " " : "") + w).length <= max) {
            cur = cur ? `${cur} ${w}` : w;
          } else {
            if (cur) lines.push(cur);
            if (w.length <= max) {
              cur = w;
            } else {
              // break long word
              let i = 0;
              while (i < w.length) {
                lines.push(w.slice(i, i + max));
                i += max;
              }
              cur = "";
            }
          }
        }
        if (cur) lines.push(cur);
        return lines;
      };

      const contentLines = wrapText(String(content), 53);

      // Build the full block: timestamp, contentLines..., createdAt, blank
      const blockLines = [timestampLine, ...contentLines, createdAtLine, ""];

      const lineFields = Array.from({ length: 15 }, (_, k) => `line${k + 1}`);
      const isEmpty = (v: any) => v == null || (typeof v === "string" && v.trim() === "");

      let firstLinePageId: string | null = null; // page where timestampLine was written
      const createdPages: any[] = [];

      // Helper to create a page with up to 15 lines from an array
      const createPageWithLines = async (linesChunk: string[], pgNumber: number) => {
        const data: Record<string, any> = { notebookId, pageNumber: pgNumber, type: "timestamp" };
        for (let i = 0; i < linesChunk.length && i < 15; i++) {
          data[lineFields[i]] = linesChunk[i];
        }
        const p = await tx.page.create({ data: data as any });
        createdPages.push(p);
        return p;
      };

      let remaining = [...blockLines];

      if (lastPage) {
        // Try to find any spot with enough consecutive empties to fit the whole block
        let placedAll = false;
        for (let start = 0; start <= 15 - remaining.length; start++) {
          let ok = true;
          for (let j = 0; j < remaining.length; j++) {
            if (!isEmpty((lastPage as any)[lineFields[start + j]])) {
              ok = false;
              break;
            }
          }
          if (ok) {
            const updateData: Record<string, any> = {};
            for (let j = 0; j < remaining.length; j++) {
              updateData[lineFields[start + j]] = remaining[j];
            }
            const updated = await tx.page.update({ where: { id: lastPage.id }, data: updateData as any });
            firstLinePageId = updated.id;
            createdPages.push(updated);
            remaining = [];
            placedAll = true;
            break;
          }
        }

        if (!placedAll) {
          // If cannot place whole block, try to fill the last page tail (from first empty to end)
          let tailStart = -1;
          for (let i = 0; i < 15; i++) {
            if (isEmpty((lastPage as any)[lineFields[i]])) {
              tailStart = i;
              break;
            }
          }
          if (tailStart !== -1) {
            let space = 0;
            for (let i = tailStart; i < 15; i++) {
              if (isEmpty((lastPage as any)[lineFields[i]])) space++;
              else break;
            }
            if (space > 0) {
              const chunk = remaining.splice(0, space);
              const updateData: Record<string, any> = {};
              for (let j = 0; j < chunk.length; j++) {
                updateData[lineFields[tailStart + j]] = chunk[j];
              }
              const updated = await tx.page.update({ where: { id: lastPage.id }, data: updateData as any });
              if (!firstLinePageId && chunk.length > 0) firstLinePageId = updated.id;
              createdPages.push(updated);
            }
          }
        }
      }

      // Create new pages as needed for remaining lines (15 lines per page)
      let nextPageNumber = (lastPage?.pageNumber ?? 0) + 1;
      while (remaining.length > 0) {
        const chunk = remaining.splice(0, 15);
        const p = await createPageWithLines(chunk, nextPageNumber);
        if (!firstLinePageId && chunk.length > 0) {
          // If the timestamp wasn't placed earlier (no lastPage space), the timestamp is at index 0 of first chunk
          firstLinePageId = p.id;
        }
        nextPageNumber += 1;
      }

      // Ensure we have a page id to link to (should always be set)
      const pageIdToLink = firstLinePageId ?? (createdPages[0]?.id ?? null);
      if (!pageIdToLink) throw new Error("Failed to allocate page for timestamp note");

      await tx.timestampNotePages.create({
        data: {
          timestampNoteId: newNote.id,
          pageId: pageIdToLink,
        },
      });

      // Return the note and the first page where it was placed
      const firstPage = createdPages.find((p) => p.id === pageIdToLink) ?? null;
      return { note: newNote, page: firstPage };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: String(error) },
      { status: 500 }
    );
  }
}