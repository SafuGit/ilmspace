import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await serverAuth();
  const userId = await getUserId(session!.user!.email!);

  if (!session || !userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "BOOK ID NOT PROVIDED" }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id, userId },
    });
    if (!book) {
      return NextResponse.json({ error: "BOOK NOT FOUND" }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}