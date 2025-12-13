import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
  } catch (error) {
    console.error("Error uploading playlist:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}