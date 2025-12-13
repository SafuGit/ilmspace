import { prisma } from "@/lib/prisma";
import { getAmountOfVideosInPlaylist } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  try {
    const { playlistId } = await params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    })

    if (!playlist) {
      return NextResponse.json(
        { message: "Playlist not found" },
        { status: 404 }
      );
    }

    const url = new URL(playlist.playlistUrl);
    const ytPlaylistId = url.searchParams.get('list');
    if (!ytPlaylistId) {
      return NextResponse.json(
        { message: "Invalid YouTube playlist URL" },
        { status: 400 }
      );
    }

    const videoCount = await getAmountOfVideosInPlaylist(ytPlaylistId);

    if (videoCount === undefined) {
      return NextResponse.json(
        { message: "Could not retrieve video count from YouTube" },
        { status: 500 }
      );
    }

    const isSynced = playlist.numberOfEpisodes === videoCount;

    return NextResponse.json(
      { isSynced },
      { status: 200 }
    );
  } catch (error) {
    throw `ERROR IN /playlists/check-if-synced/[playlistId] ${error}`;
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}