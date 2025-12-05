import { serverAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/lib/uploadImage";
import { NextResponse } from "next/server";

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await serverAuth();
    const userId = await getUserId(session!.user!.email!);
    const { bookId } = await params;

    if (!session || !userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    if (!bookId) {
      return NextResponse.json(
        { error: "BOOK ID NOT PROVIDED" },
        { status: 400 }
      );
    }

    const formdata = await request.formData();

    const file = formdata.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "NO FILE PROVIDED." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "INVALID FILE TYPE" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "FILE TOO LARGE. MAX 5MB" }, { status: 413 });
    }

    if (file.name.length > 255) {
      return NextResponse.json({ error: "FILE NAME TOO LONG. MAX 255 CHARACTERS" }, { status: 400 });
    }

    let uploaded;
    try {
      uploaded = await uploadImageToCloudinary(
        file,
        `books/${userId}/${bookId}/thumbnails`
      );
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "FAILED TO UPLOAD TO CLOUDINARY", log: error },
        { status: 500 }
      );
    }
    const coverUrl = uploaded.secure_url;

    try {
      prisma.book.update({
        where: { id: bookId, userId },
        data: { thumbnailUrl: coverUrl },
      });
    } catch (error) {
      try {
        await cloudinary.uploader.destroy(uploaded.public_id, {
          resource_type: "image",
        });
        console.log(`Cleaned up Cloudinary file: ${uploaded.public_id}`);
      } catch (cleanUpError) {
        console.error("Failed to cleanup Cloudinary:", cleanUpError);
      }
      return NextResponse.json(
        { error: "FAILED TO UPDATE BOOK WITH THUMBNAIL URL", log: error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR IN /books/upload-thumbnail", log: error },
      { status: 500 }
    );
  }
}
