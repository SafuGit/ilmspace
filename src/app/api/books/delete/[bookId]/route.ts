import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { bookId: string } }) {
  const session = await serverAuth();
  const userId = await getUserId(session!.user!.email!);
  if (!session || !userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = params;
  
  if (!bookId || typeof bookId !== "string") {
    return new Response("Invalid book ID", { status: 400 });
  }

  try { 
    const deletedBook = await prisma.book.delete({
      where: {
        id: bookId,
        userId: userId,
      },
    });
    return NextResponse.json({message: "Book deleted successfully", book: deletedBook}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error }, 
      { status: 500 }
    )
  }
}