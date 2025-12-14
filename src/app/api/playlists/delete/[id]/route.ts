import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await serverAuth();
  const userId = await getUserId(session!.user!.email!);
  if (!session || !userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  if (!id || typeof id !== "string") {
    return new Response("Invalid book ID", { status: 400 });
  }

  try {
    const deletedPlaylist = await prisma.playlist.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
    return NextResponse.json(
      { message: "Playlist deleted successfully.", deletedPlaylist },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}
