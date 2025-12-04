import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { getUserId } from "@/lib/getUserId";

export async function GET() {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = getUserId(session);
  return NextResponse.json({ userId });
}
