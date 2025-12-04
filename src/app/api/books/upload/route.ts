import { serverAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await serverAuth();
    const userId = await getUserId(session!);

    if (!session || !userId) {
      return NextResponse.json({error: "UNAUTHORIZED"}, {status: 401})
    }

    const formdata = await request.formData();

    const file = formdata.get('file') as File | null
    if (!file) {
      return NextResponse.json({error: "NO FILE PROVIDED."}, {status: 400})
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({error: "INVALID FILE TYPE"}, {status: 400})
    }

    if (file.size > 30000000) {
      return NextResponse.json({error: "FILE TOO LARGE"}, {status: 413})
    }

    const title = formdata.get('title');
    const author = formdata.get('author');
    const language = formdata.get('language');
    const category = formdata.get('category');

    if (!title || !author || !language || !category) {
      return NextResponse.json({error: "MISSING REQUIRED FIELDS"}, {status: 400})
    }

    if (typeof title === 'string' && title.length > 255) {
      return NextResponse.json({error: "TITLE TOO LONG"}, {status: 400})
    }

    const filenameParts = file.name.split('.');
    const filename = filenameParts.length > 1 
      ? filenameParts.slice(0, -1).join('.') 
      : file.name;

    const existingBook = await prisma.book.findFirst({
      where: {
        userId,
        title: title as string,
        author: author as string,
      }
    });

    if (existingBook) {
      return NextResponse.json({error: "BOOK ALREADY EXISTS"}, {status: 409})
    }

    let uploaded;
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      uploaded = await uploadFile(bytes, userId, filename);
    } catch (uploadError) {
      console.error('❌ Cloudinary upload failed:', uploadError);
      return NextResponse.json(
        { error: "FILE UPLOAD FAILED", details: uploadError }, 
        { status: 500 }
      )
    }

    const data = {
      userId,
      title: title as string,
      author: author as string,
      language: language as string,
      description: (formdata.get('description') as string) || '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: category as any,
      fileSize: file.size,
      mimeType: file.type,
      fileUrl: uploaded.url,
      secureUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      pageCount: 0,
      thumbnailUrl: (formdata.get("thumbnailUrl") as string) || '',
      lastOpenedAt: new Date(),
    }

    try {
      const book = await prisma.book.create({ data })
      return NextResponse.json({ success: true, book }, { status: 201 })
    } catch (dbError) {
      console.error('❌ Database save failed:', dbError);

      try {
        await cloudinary.uploader.destroy(uploaded.public_id, { resource_type: 'raw' });
        console.log(`🗑️ Cleaned up Cloudinary file: ${uploaded.public_id}`)
      } catch (cleanUpError) {
        console.error("❌ Failed to cleanup Cloudinary:", cleanUpError)
      }

      return NextResponse.json(
        { error: "DATABASE SAVE FAILED", details: dbError }, 
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: "INTERNAL SERVER ERROR", details: error }, 
      { status: 500 }
    )
  }
}