import { serverAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const session = await serverAuth();
  const userId = await getUserId(session!.user!.email!);
  if (!session || !userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { bookId } = await params;
  
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
    try {
      await cloudinary.uploader.destroy(deletedBook.publicId, {
        resource_type: "raw",
      });
      return NextResponse.json({ message: "Book deleted successfully." }, { status: 200 });
    } catch (cloudError) {
      console.error("Error deleting file from Cloudinary:", cloudError);
      return NextResponse.json(
        { error: "Failed to delete file from storage." }, 
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error }, 
      { status: 500 }
    )
  }
}