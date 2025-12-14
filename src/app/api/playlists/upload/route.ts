/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    // Authentication check
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      return NextResponse.json(
        { message: "Playlist name is required" },
        { status: 400 }
      );
    }

    if (body.name.length > 200) {
      return NextResponse.json(
        { message: "Playlist name must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (!body.playlistUrl || typeof body.playlistUrl !== "string") {
      return NextResponse.json(
        { message: "Playlist URL is required" },
        { status: 400 }
      );
    }

    // Validate YouTube playlist URL format
    const youtubePlaylistRegex =
      /^https:\/\/(www\.)?youtube\.com\/(playlist\?list=|watch\?v=.+&list=).+$/;
    if (!youtubePlaylistRegex.test(body.playlistUrl)) {
      return NextResponse.json(
        { message: "Invalid YouTube playlist URL format" },
        { status: 400 }
      );
    }

    // Validate description (optional but limited length if provided)
    if (body.description && typeof body.description !== "string") {
      return NextResponse.json(
        { message: "Description must be a string" },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 1000) {
      return NextResponse.json(
        { message: "Description must be 1000 characters or less" },
        { status: 400 }
      );
    }

    // Validate books array (optional)
    if (body.books !== undefined) {
      if (!Array.isArray(body.books)) {
        return NextResponse.json(
          { message: "Books must be an array" },
          { status: 400 }
        );
      }

      // Validate each book has required fields
      for (const book of body.books) {
        if (!book.id || typeof book.id !== "string") {
          return NextResponse.json(
            { message: "Each book must have a valid ID" },
            { status: 400 }
          );
        }
      }
    }

    // Get user from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    try {
      const playlist = await prisma.playlist.create({
        data: {
          name: body.name.trim(),
          description: body.description?.trim() || null,
          playlistUrl: body.playlistUrl,
          userId: user.id,
          numberOfEpisodes: body.numberOfEpisodes || 0,
          thumbnailUrl: body.thumbnailUrl || null,

          // connect books if provided
          books: body.books?.length
            ? {
                connect: body.books.map((book: any) => ({ id: book.id })),
              }
            : undefined,

          notebook: {
            create: {
              userId: user.id,
              name: body.name.trim(), 
              description: body.description?.trim() || null,
            },
          },
        },
        include: {
          books: true,
          notebook: true,
        },
      });

      return NextResponse.json(
        {
          message: "Playlist created successfully",
          playlist,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating playlist in database:", error);
      return NextResponse.json(
        { message: "Failed to create playlist" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading playlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
