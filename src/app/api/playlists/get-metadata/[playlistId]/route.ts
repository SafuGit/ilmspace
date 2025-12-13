import { getAmountOfVideosInPlaylist, getFirstThumbnailInPlaylist } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ playlistId: string }> }) {
  try {
    const { playlistId } = await params;

    // Validate playlistId
    if (!playlistId || typeof playlistId !== 'string') {
      return NextResponse.json(
        { error: "Playlist ID is required and must be a string." },
        { status: 400 }
      );
    }

    // Validate YouTube playlist ID format (typically 34 characters starting with PL)
    const playlistIdPattern = /^(PL|UU|LL|FL|RD)[a-zA-Z0-9_-]{32}$|^[a-zA-Z0-9_-]{34}$/;
    if (!playlistIdPattern.test(playlistId)) {
      return NextResponse.json(
        { error: "Invalid YouTube playlist ID format." },
        { status: 400 }
      );
    }

    try {
      const amountOfVideos = await getAmountOfVideosInPlaylist(playlistId);
      const thumbnailUrl = await getFirstThumbnailInPlaylist(playlistId);

      if (amountOfVideos === undefined || thumbnailUrl === undefined) {
        return NextResponse.json(
          { error: "Could not retrieve playlist metadata." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          amountOfVideos,
          thumbnailUrl,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error retrieving playlist metadata:", error);
      return NextResponse.json(
        { error: "Error retrieving playlist metadata." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing request parameters:", error);
    return NextResponse.json(
      { error: "Error parsing request parameters." },
      { status: 400 }
    );
  }
}