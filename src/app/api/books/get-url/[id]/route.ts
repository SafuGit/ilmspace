import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "BOOK ID NOT PROVIDED" }, { status: 400 });
  }

  try {
    const bookUrl = await prisma.book.findUnique({
      where: { id },
      select: { secureUrl: true },
    });
    if (!bookUrl) {
      return NextResponse.json({ error: "BOOK NOT FOUND" }, { status: 404 });
    }
    return NextResponse.json(bookUrl, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}