import { getAmountOfVideosInPlaylist, getFirstThumbnailInPlaylist } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ playlistId: string }> }) {
  try {
    const { playlistId } = await params;
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