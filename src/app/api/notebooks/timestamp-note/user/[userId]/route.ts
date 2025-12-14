import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    const notes = await prisma.timestampNote.findMany({
      where: { userId },
      orderBy: { timestamp: "asc" },
    });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error },
      { status: 500 }
    );
  }
}