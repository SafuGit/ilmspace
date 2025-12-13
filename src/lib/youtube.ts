import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getAmountOfVideosInPlaylist(playlistId: string) {
  try {
    const response = await youtube.playlistItems.list({
      part: ["contentDetails"],
      playlistId: playlistId,
    })

    const totalVideos = response.data.items?.length
    return totalVideos;
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    throw error;
  }
}

export async function getFirstThumbnailInPlaylist(playlistId: string) {
  try {
    const response = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistId,
      maxResults: 1,
    })

    const thumbnailUrl = response.data.items?.[0]?.snippet?.thumbnails?.default?.url;
    return thumbnailUrl;
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    throw error;
  }
}