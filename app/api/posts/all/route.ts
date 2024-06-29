import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// export const revalidate = 0;

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        authorId: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return NextResponse.json(posts, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error retrieving posts:", err);
    return NextResponse.json(
      { error: "Failed to retrieve posts" },
      { status: 500 }
    );
  }
}
