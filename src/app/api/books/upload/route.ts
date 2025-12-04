import { serverAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { getUserId } from "@/lib/getUserId";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await serverAuth();
  const userId = await getUserId(session!);

  if (!session) {
    return NextResponse.json({error: "UNAUTHORIZED"}, {status: 401})
  }

  if (!userId) {
    return NextResponse.json({error: "UNAUTHORIZED"}, {status: 401})
  }

  const formdata = await request.formData();

  const file = formdata.get('file') as File | null

  if (!file) {
    return NextResponse.json({error: "NO FILE PROVIDED."}, {status: 400})
  }

  if (file.type != "application/pdf") {
    return NextResponse.json({error: "INVALID FILE TYPE"}, {status: 400})
  }

  if (file.size > 30000000) {
    return NextResponse.json({error: "FILE TO LARGE"}, {status: 413})
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = file.name.split('.')[0];
  const uploaded = await uploadFile(bytes, userId, filename);

  const data = {
    userId,
    title: formdata.get('title') as string,
    author: formdata.get('author') as string,
    language: formdata.get('language') as string,
    description: formdata.get('description') as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: formdata.get('category') as any,
    fileSize: file.size,
    mimeType: file.type,
    fileUrl: uploaded.url,
    secureUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    pageCount: 0,
    thumbnailUrl: formdata.get("thumbnailUrl") as string,
    lastOpenedAt: new Date(),
  }

  try {
    const book = await prisma.book.create({
      data
    })

    return NextResponse.json({ success: true, book }, { status: 201 })
  } catch (error) {
    console.error('❌ Prisma create failed:', error);

    try {
      await cloudinary.uploader.destroy(uploaded.public_id, { resource_type: 'raw' });
      console.log(`Cleaned up Cloudinary file: ${uploaded.public_id}`)
    } catch (cleanUpError) {
      console.error("Failed to cleanup Cloudinary.", cleanUpError)
    }

    return NextResponse.json(
      { error: "Failed to create book in database", details: error }, 
      { status: 500 }
    )
  }
}