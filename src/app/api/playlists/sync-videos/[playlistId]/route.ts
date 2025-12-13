import { prisma } from "@/lib/prisma";
import { syncPlaylistVideos } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ playlistId: string }> }) { 
  try {
    const { playlistId } = await params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { playlistUrl: true, id: true },
    });

    if (!playlist) {
      return NextResponse.json(
        { message: "Playlist not found" },
        { status: 404 }
      );
    }

    try {
      syncPlaylistVideos(playlist.id, new URL(playlist.playlistUrl).searchParams.get("list")!);
      return NextResponse.json(
        { message: "Playlist videos sync started" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error syncing playlist videos:", error);
      return NextResponse.json(
        { message: "Error syncing playlist videos" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`ERROR IN /playlists/sync-videos/[playlistId]`, error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}