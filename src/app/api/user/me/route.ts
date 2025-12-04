import { NextResponse } from "next/server";
import { getUserId } from "@/lib/getUserId";
import { serverAuth } from "@/lib/auth";

export async function GET() {
  const session = await serverAuth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserId(session.user!.email!);
  return NextResponse.json({ userId });
}
