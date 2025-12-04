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
    const books = await prisma.book.findMany({
      where: { userId },
    });
    return NextResponse.json(books, {status: 200});
  } catch(error) {
    throw `ERROR IN /user/[id] ${error}`;
  }
}
