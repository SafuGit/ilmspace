import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ playlistId: string }> }) {
  try {
    const session = await serverAuth();
    const userId = await getUserId(session!.user!.email!);

    if (!session || !userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { playlistId } = await params;

    if (!playlistId) {
      return NextResponse.json({ error: "PLAYLIST ID NOT PROVIDED" }, { status: 400 });
    }

    const timestampNotes = await prisma.timestampNote.findMany({
      where: { playlistId, userId: userId },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json(timestampNotes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}