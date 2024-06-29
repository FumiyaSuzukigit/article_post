import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error retrieving posts:", err);
    return NextResponse.json(
      { error: "Failed to retrieve posts" },
      { status: 500 }
    );
  }
}
