import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth0.getSession();
  if (!session || !session.user?.picture) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await fetch(session.user.picture);
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const imageBuffer = await res.arrayBuffer();

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
    },
  });
}
