import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    try {
      const response = prisma.playlist.create(body);
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