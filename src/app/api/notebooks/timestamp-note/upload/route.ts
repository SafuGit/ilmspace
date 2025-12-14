import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body) {
      return new Response("Request body is missing", { status: 400 });
    }
    const { userId, playlistId, videoId, content, timestamp } = body;

    if (!userId || !playlistId || !videoId || !content || timestamp === undefined) {
      return new Response("Missing required fields", { status: 400 });
    }

    const newNote = await prisma.timestampNote.create({
      data: {
        userId,
        playlistId: playlistId || null,
        videoId: videoId || null,
        content,
        timestamp,
      }
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}