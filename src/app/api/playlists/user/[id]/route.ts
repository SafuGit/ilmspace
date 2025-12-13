import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "USER ID NOT PROVIDED" }, { status: 400 });
  }

  try { 
    const playlists = await prisma.playlist.findMany({
      where: { userId },
    });
    return NextResponse.json(playlists, {status: 200});
  } catch(error) {
    throw `ERROR IN /user/[id] ${error}`;
  }
}
