import { serverAuth } from "@/lib/auth";
import { getUserId } from "@/lib/getUserId";
import { NextResponse } from "next/server";
import { pdf } from "pdf-to-img";

export async function POST(request: Request) {
  try {
    const session = await serverAuth();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const userId = await getUserId(session.user!.email!);
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "NO FILE PROVIDED." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const document = await pdf(buffer, { scale: 2 });
    const firstPage = await document.getPage(1);

    return new NextResponse(
      new Uint8Array(firstPage),
      {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline; filename="thumbnail.png"'
        }
      }
    );

  } catch (error) {
    return NextResponse.json({ error: "INTERNAL SERVER ERROR in /books/generate-thumbnail", log: error }, { status: 500 });
  }
}