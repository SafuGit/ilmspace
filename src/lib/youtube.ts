import { google } from "googleapis";
import { prisma } from "./prisma";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getAmountOfVideosInPlaylist(playlistId: string) {
  try {
    const response = await youtube.playlistItems.list({
      part: ["contentDetails"],
      playlistId: playlistId,
    });

    const totalVideos = response.data.items?.length;
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
    });

    const thumbnailUrl =
      response.data.items?.[0]?.snippet?.thumbnails?.default?.url;
    return thumbnailUrl;
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    throw error;
  }
}

export async function syncPlaylistVideos(
  playlistId: string,
  ytPlaylistId: string
) {
  const res = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    playlistId: ytPlaylistId,
    maxResults: 50,
  });

  const items = res.data.items || [];

  if (items.length === 0) return [];

  const videosData = items.map(item => ({
    playlistId,
    title: item.snippet?.title ?? 'Untitled',
    description: item.snippet?.description ?? null,
    videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails?.videoId}`,
  }));

  await prisma.$transaction([
    prisma.video.deleteMany({
      where: { playlistId },
    }),
    prisma.video.createMany({
      data: videosData,
      skipDuplicates: true,
    }),
  ]);
}
