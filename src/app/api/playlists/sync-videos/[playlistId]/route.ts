import { prisma } from "@/lib/prisma";
import { syncPlaylistVideos } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ playlistId: string }> }) { 
  try {
    const { playlistId } = await params;
    // Validate playlistId
    if (!playlistId || typeof playlistId !== "string") {
      return NextResponse.json(
        { message: "Playlist ID is required and must be a string." },
        { status: 400 }
      );
    }

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

    if (!playlist.playlistUrl || typeof playlist.playlistUrl !== "string") {
      return NextResponse.json(
        { message: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    let ytPlaylistId: string | null = null;
    try {
      ytPlaylistId = new URL(playlist.playlistUrl).searchParams.get("list");
    } catch {
      return NextResponse.json(
        { message: "Invalid playlist URL" },
        { status: 400 }
      );
    }

    if (!ytPlaylistId) {
      return NextResponse.json(
        { message: "Invalid YouTube playlist URL" },
        { status: 400 }
      );
    }

    const playlistIdPattern = /^(PL|UU|LL|FL|RD)[a-zA-Z0-9_-]{32}$|^[a-zA-Z0-9_-]{34}$/;
    if (!playlistIdPattern.test(ytPlaylistId)) {
      return NextResponse.json(
        { message: "Invalid YouTube playlist ID format" },
        { status: 400 }
      );
    }

    try {
      syncPlaylistVideos(playlist.id, ytPlaylistId);
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